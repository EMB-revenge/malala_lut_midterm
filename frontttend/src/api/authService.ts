const API_BASE = "/api";

interface AuthResponse {
  message: string;
  token: string;
}

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Login failed: ${response.statusText}`);
  }

  return response.json();
};

export const logout = (): void => {
  localStorage.removeItem("token");
};
