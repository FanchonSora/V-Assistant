const API_BASE = "http://localhost:8000";

export async function deleteTask(token: string, taskId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to delete task");
  }
}