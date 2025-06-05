import axios from "axios";

const API_BASE = "http://localhost:8000";

export async function deleteTask(token: string, taskId: string): Promise<void> {
  try {
    const res = await axios.delete(`${API_BASE}/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status !== 200 && res.status !== 204) {
      throw new Error("Failed to delete task");
    }
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Failed to delete task";
    throw new Error(message);
  }
}

export async function updateTask(token: string, taskId: string, data: Partial<{ title: string; task_date: string; task_time: string }>) {
  const response = await axios.patch(
    `${API_BASE}/tasks/${taskId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}