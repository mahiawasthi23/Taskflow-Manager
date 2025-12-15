"use client";

import React, { useState } from "react";

export default function TaskCard({
  task,
  isAdmin,
  onDelete,
  onUpdate,
  users = [],
}: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const formattedDate = editedTask.due_date
    ? new Date(editedTask.due_date).toISOString().substring(0, 10)
    : "";

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    "in progress": "In Progress",
    done: "Done",
  };

  const status = statusLabels[editedTask.status?.toLowerCase()] || editedTask.status || "Pending";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditedTask((prev: any) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    onUpdate(editedTask);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedTask({ ...task });
    setIsEditing(false);
  }

  return (
    <div className="border p-4 rounded shadow-sm bg-white flex flex-col gap-3">
      {isEditing ? (
        <>
          <input
            className="border p-1 rounded"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
          />
          <textarea
            className="border p-1 rounded"
            name="description"
            value={editedTask.description || ""}
            onChange={handleChange}
          />
          <select
            name="assigned_to"
            value={editedTask.assigned_to || ""}
            onChange={handleChange}
            className="border p-1 rounded"
          >
            <option value="">Unassigned</option>
            {users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="due_date"
            value={formattedDate}
            onChange={handleChange}
            className="border p-1 rounded"
          />
          <select
            name="status"
            value={editedTask.status}
            onChange={handleChange}
            className="border p-1 rounded"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-400 text-black px-3 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description || "No description"}</p>

          {task.assigned_to_name && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Assigned to:</span> {task.assigned_to_name}
            </p>
          )}

          <p className="text-sm text-gray-700">
            <span className="font-medium">Deadline:</span>{" "}
            {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No deadline"}
          </p>

          <p className="text-xs text-gray-500">
            <span className="font-medium">Status:</span> {status}
          </p>

          <div className="w-full h-3 bg-gray-200 rounded overflow-hidden">
            <div
              className={`h-full rounded ${
                task.progress === 100
                  ? "bg-green-600"
                  : task.progress > 0
                  ? "bg-yellow-500"
                  : "bg-gray-400"
              }`}
              style={{ width: `${task.progress || 0}%` }}
            />
          </div>

          {isAdmin && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
