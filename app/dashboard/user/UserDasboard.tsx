"use client";
import { useEffect, useState } from "react";
import TaskCard from "@/app/component/TaskCard";

export default function UserDashboard({ user }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();

    const assignedTasks = (data.tasks || []).filter(
      (t: any) => t.assigned_to === user.id
    );

    setTasks(assignedTasks);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateProgress = async (taskId: number, progress: number) => {
    await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, progress }),
    });

    fetchTasks(); 
  };

  return (
    <div className="p-6 flex flex-col gap-6">

      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-bold">Welcome, {user.name}</h2>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned to you</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="border rounded p-4 bg-white shadow">
            <TaskCard task={task} />

            <div className="flex gap-2 mt-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => updateProgress(task.id, 0)}
              >
                Pending
              </button>

              <button
                className="px-3 py-1 border rounded"
                onClick={() => updateProgress(task.id, 50)}
              >
                In Progress
              </button>

              <button
                className="px-3 py-1 border rounded"
                onClick={() => updateProgress(task.id, 100)}
              >
                Done
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
