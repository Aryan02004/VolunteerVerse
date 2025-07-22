import { NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/models/users";

// GET: Fetch user by ID
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await getUserById(id);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
        console.error("User creation error:", error);
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}

// PATCH: Update a user by ID (Restrict role update)
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
    }

    // Prevent role escalation
    if (body.role) {
      return NextResponse.json(
        { error: "Cannot update user role via this route" },
        { status: 403 }
      );
    }

    const updatedUser = await updateUser(id, body);
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
        console.error("User creation error:", error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}

// DELETE: Remove a user by ID (Restrict admin deletion)
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Fetch user before deleting
    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting an admin
    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Cannot delete an admin user" },
        { status: 403 }
      );
    }

    await deleteUser(id);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
        console.error("User creation error:", error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}
