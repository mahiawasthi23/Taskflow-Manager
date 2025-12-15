"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type Props = {
  onSubmit: (data: any) => void;
  users: any[];
};

export default function TaskForm({ onSubmit, users }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = () => {
    if (!title) return;

    onSubmit({
      title,
      description,
      assigned_to: assignedTo ? Number(assignedTo) : null,
      due_date: dueDate ? new Date(dueDate) : null,
    });

    // reset form
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDueDate("");
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded bg-white shadow">
      <h3 className="text-lg font-semibold">Create New Task</h3>

      <div>
        <Label>Task Title</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
      </div>

      <div>
        <Label>Assign To User</Label>
        <select
          className="w-full border rounded px-3 py-2"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Deadline</Label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <Button onClick={handleSubmit}>Save Task</Button>
    </div>
  );
}

