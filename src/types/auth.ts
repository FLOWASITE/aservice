export type AppRole = "admin" | "manager" | "nhanvien";

export interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
}

export interface JwtPayload {
  sub: string;
  preferred_username: string;
  email: string;
  realm_access?: {
    roles: string[];
  };
  exp: number;
  iat: number;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: AppRole[];
}
