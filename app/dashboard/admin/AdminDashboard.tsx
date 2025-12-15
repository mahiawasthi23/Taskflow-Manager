"use client";

import { useEffect, useState } from "react";
import TaskForm from "@/app/component/TaskForm";
import TaskCard from "@/app/component/TaskCard";
import { AnyAaaaRecord } from "node:dns";

export default function AdminDashboard({ user }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/tasks");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load tasks");
        return;
      }

      setTasks(data.tasks || []);
    } catch {
      setError("Something went wrong while fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch {
      console.log("Failed to load users");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const createTask = async (task: any) => {
    setError("");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create task");
        return;
      }

      fetchTasks();
    } catch (error) {
      setError("Failed to create task: Network or server error");
    }
  };

  const deleteTask = async (id: number) => {
    const res = await fetch("/api/tasks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchTasks();
    } else {
      setError("Failed to delete task");
    }
  };

  const updateTask = async (updatedTask: any) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT", // or PATCH if your API uses it
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (res.ok) {
        fetchTasks();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update task");
      }
    } catch {
      setError("Failed to update task: Network or server error");
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="border p-4 rounded bg-white shadow">
        <h2 className="text-xl font-bold">Admin Dashboard</h2>
        <p className="text-sm text-gray-600">
          Logged in as <b>{user.name}</b> ({user.email})
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm border border-red-200 p-2 rounded">
          {error}
        </p>
      )}

      <TaskForm onSubmit={createTask} users={users} />

      <div>
        <h3 className="text-lg font-semibold mb-2">All Tasks</h3>

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks created yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isAdmin
                onDelete={() => deleteTask(task.id)}
                onUpdate={(task: any) => updateTask(task)}
                users={users}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
