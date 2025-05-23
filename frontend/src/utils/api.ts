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

export async function get<T>(url: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getTasks(token?: string, date?: string){
  let url = "/tasks/";
  if (date) url += `?date=${date}`;
  return await get<Event[]>(url, token);
}

export async function getTasksByRange(token?: string, startDate?: string, endDate?: string) {
  let url = "/tasks/range?";
  if (startDate) url += `start_date=${encodeURIComponent(startDate)}&`;
  if (endDate) url += `end_date=${encodeURIComponent(endDate)}`;
  return await get<Event[]>(url, token);
}