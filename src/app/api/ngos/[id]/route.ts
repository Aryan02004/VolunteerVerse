import { NextResponse } from "next/server";
import { getNgoById, updateNgo, deleteNgo } from "@/models/ngos";

// GET: Fetch a single NGO by ID
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "NGO ID is required" }, { status: 400 });
    }

    const ngo = await getNgoById(id);
    if (!ngo) {
      return NextResponse.json({ error: "NGO not found" }, { status: 404 });
    }

    return NextResponse.json(ngo);
  } catch (error) {
        const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH: Update an NGO
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const updates = await req.json();

    if (!id) {
      return NextResponse.json({ error: "NGO ID is required" }, { status: 400 });
    }

    // Prevent user_id updates
    if ("user_id" in updates) {
      return NextResponse.json({ error: "Cannot update NGO owner" }, { status: 403 });
    }

    const updatedNgo = await updateNgo(id, updates);
    return NextResponse.json(updatedNgo);
  } catch (error) {
        const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Remove an NGO (only owner can delete)
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { user_id } = await req.json(); // Get user ID from request body

    if (!id || !user_id) {
      return NextResponse.json({ error: "NGO ID and User ID are required" }, { status: 400 });
    }

    await deleteNgo(id, user_id);
    return NextResponse.json({ message: "NGO deleted successfully" });
  } catch (error) {
        const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
