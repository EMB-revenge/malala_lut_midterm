import type { Environment, Microservice, ServiceStatus } from "../types";

const API_BASE = "/api";

export interface ServiceInput {
  name: string;
  endpointUrl?: string;
  environment?: Environment;
  status?: ServiceStatus;
  version?: string;
}

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseError = async (response: Response): Promise<string> => {
  const data = await response.json().catch(() => ({}));
  if (Array.isArray(data.details)) {
    return data.details
      .map((d: { message: string }) => d.message)
      .join(", ");
  }
  return data.error || `Request failed with status ${response.status}`;
};

export const fetchServices = async (): Promise<Microservice[]> => {
  const response = await fetch(`${API_BASE}/services`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
};

export const createService = async (
  service: ServiceInput
): Promise<Microservice> => {
  const response = await fetch(`${API_BASE}/services`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(service),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
};

export const updateService = async (
  id: string,
  updates: Partial<ServiceInput>
): Promise<Microservice> => {
  const response = await fetch(`${API_BASE}/services/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
};

export const deleteService = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/services/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error(await parseError(response));
};
