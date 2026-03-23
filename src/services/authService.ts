import type { KeycloakTokenResponse, JwtPayload, AuthUser, AppRole } from "@/types/auth";

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080/auth";
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || "master";
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "aservice";
const USE_MOCK = !import.meta.env.VITE_KEYCLOAK_URL;

const TOKEN_ENDPOINT = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

// Mock accounts for development
const MOCK_ACCOUNTS = [
  { username: "duyvp@gmail.com", password: "123456", displayName: "Duy VP", roles: ["admin"] },
  { username: "manager@gmail.com", password: "123456", displayName: "Manager", roles: ["manager"] },
  { username: "nhanvien@gmail.com", password: "123456", displayName: "Nhân viên", roles: ["nhanvien"] },
];

function createMockJwt(account: typeof MOCK_ACCOUNTS[0]): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    sub: crypto.randomUUID(),
    preferred_username: account.displayName,
    email: account.username,
    realm_access: { roles: account.roles },
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  }));
  return `${header}.${payload}.mock-signature`;
}

function decodeJwt(token: string): JwtPayload {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function mapRoles(keycloakRoles: string[]): AppRole[] {
  const roleMap: Record<string, AppRole> = {
    admin: "admin",
    manager: "manager",
    nhanvien: "nhanvien",
  };
  return keycloakRoles
    .map((r) => roleMap[r.toLowerCase()])
    .filter(Boolean) as AppRole[];
}

export function getUserFromToken(accessToken: string): AuthUser {
  const payload = decodeJwt(accessToken);
  const keycloakRoles = payload.realm_access?.roles || [];
  const roles = mapRoles(keycloakRoles);
  return {
    id: payload.sub,
    username: payload.preferred_username,
    email: payload.email,
    roles: roles.length > 0 ? roles : ["nhanvien"],
  };
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwt(token);
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export async function login(username: string, password: string): Promise<KeycloakTokenResponse> {
  if (USE_MOCK) {
    const account = MOCK_ACCOUNTS.find(
      (a) => a.username === username && a.password === password
    );
    if (!account) throw new Error("Sai tên đăng nhập hoặc mật khẩu");
    const token = createMockJwt(account);
    return {
      access_token: token,
      refresh_token: "mock-refresh-token",
      expires_in: 3600,
      refresh_expires_in: 86400,
      token_type: "Bearer",
    };
  }

  const body = new URLSearchParams({
    grant_type: "password",
    client_id: KEYCLOAK_CLIENT_ID,
    username,
    password,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error_description || "Đăng nhập thất bại");
  }

  return res.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<KeycloakTokenResponse> {
  if (USE_MOCK) {
    // In mock mode, just return a new token with the same first mock account
    const token = createMockJwt(MOCK_ACCOUNTS[0]);
    return {
      access_token: token,
      refresh_token: "mock-refresh-token",
      expires_in: 3600,
      refresh_expires_in: 86400,
      token_type: "Bearer",
    };
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: KEYCLOAK_CLIENT_ID,
    refresh_token: refreshToken,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error("Phiên đăng nhập hết hạn");
  }

  return res.json();
}

export function storeTokens(tokens: KeycloakTokenResponse) {
  localStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function getStoredAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export function getStoredRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}
