// src/utils/api.ts
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

export async function post<T>(url: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
