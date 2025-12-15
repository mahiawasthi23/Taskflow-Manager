import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tasks, users } from "@/db/schema";
import { getSessionFromRequest } from "@/lib/session";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = getSessionFromRequest(req);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (session.role === "admin") {
      const allTasks = await db
        .select({
          id: tasks.id,
          title: tasks.title,
          description: tasks.description,
          status: tasks.status,
          progress: tasks.progress,
          due_date: tasks.due_date,
          assigned_to: tasks.assigned_to,
          assigned_user_name: users.name,
          assigned_user_email: users.email,
        })
        .from(tasks)
        .leftJoin(users, eq(tasks.assigned_to, users.id));

      return NextResponse.json({ tasks: allTasks });
    }
    const userTasks = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        progress: tasks.progress,
        due_date: tasks.due_date,
        assigned_to: tasks.assigned_to,
      })
      .from(tasks)
      .where(eq(tasks.assigned_to, session.userId));

    return NextResponse.json({ tasks: userTasks });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = getSessionFromRequest(req);

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, assigned_to, due_date } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const dueDateValue = due_date ? new Date(due_date) : null;

    const created = await db
      .insert(tasks)
      .values({
        title,
        description,
        assigned_to: assigned_to || null,
        due_date: dueDateValue,
        created_by: session.userId,
        status: "pending",
        progress: 0,
      })
      .returning();

    if (!created || created.length === 0) {
      return NextResponse.json(
        { error: "Task creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      task: created[0],
    });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = getSessionFromRequest(req);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, description, status, progress, assigned_to, due_date } =
      body;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const existingTask = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, id))
      .then((res) => res[0]);

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    const isAdmin = session.role === "admin";
    const isAssignedUser = existingTask.assigned_to === session.userId;

    if (!isAdmin && !isAssignedUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const dueDateValue = due_date ? new Date(due_date) : null;

    if (isAdmin) {
      await db
        .update(tasks)
        .set({
          title,
          description,
          status,
          progress,
          assigned_to: assigned_to || null,
          due_date: dueDateValue,
        })
        .where(eq(tasks.id, id));
    } else {
      await db
        .update(tasks)
        .set({
          status,
          progress,
        })
        .where(eq(tasks.id, id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/tasks error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = getSessionFromRequest(req);

  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    await db.delete(tasks).where(eq(tasks.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
