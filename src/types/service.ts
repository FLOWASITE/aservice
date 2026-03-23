export interface Service {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
}

export interface ServiceCreatePayload {
  name: string;
  description: string;
  status: "active" | "inactive";
}
