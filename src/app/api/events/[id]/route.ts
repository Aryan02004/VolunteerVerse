import { NextResponse } from "next/server";
import { getEventById, updateEvent, deleteEvent } from "@/models/events";

// GET: Fetch a specific event by ID
export async function GET(req: Request, context: { params: Promise<Promise<{ id: string }>> }) {
  try {
    const { id } = await context.params; // Await the promise

    const event = await getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT: Update an event (Only the NGO that owns it can update)
export async function PATCH(req: Request, context: { params: Promise<Promise<{ id: string }>> }) {
  try {
    const { id } = await context.params; // Removed await
    const { ngo_id, ...updates } = await req.json();

    if (!ngo_id) {
      return NextResponse.json({ error: "NGO ID is required" }, { status: 400 });
    }

    const event = await getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.ngo_id !== ngo_id) {
      return NextResponse.json({ error: "Unauthorized: This NGO does not own the event" }, { status: 403 });
    }

    // Prevent ownership transfer
    if (updates.ngo_id && updates.ngo_id !== event.ngo_id) {
      return NextResponse.json({ error: "Cannot transfer event ownership" }, { status: 403 });
    }

    const updatedEvent = await updateEvent(id, updates);
    return NextResponse.json(updatedEvent);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Remove an event (Only the NGO that owns it can delete)
export async function DELETE(req: Request, context: { params: Promise<Promise<{ id: string }>> }) {
  try {
    const { id } = await context.params; // Removed await
    const { ngo_id } = await req.json();

    if (!ngo_id) {
      return NextResponse.json({ error: "NGO ID is required" }, { status: 400 });
    }

    const event = await getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.ngo_id !== ngo_id) {
      return NextResponse.json({ error: "Unauthorized: This NGO does not own the event" }, { status: 403 });
    }

    await deleteEvent(id);
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
