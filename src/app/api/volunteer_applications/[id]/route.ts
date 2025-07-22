import { NextResponse } from "next/server";
import {
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} from "@/models/volunteer_applications";
import { getEventById } from "@/models/events"; // To check NGO ownership

// GET: Fetch a specific volunteer application
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const application = await getApplicationById(id);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
        const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PATCH: Update application status (Only NGO can approve/reject)
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { status, ngo_id } = await req.json();

    if (!id || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
    }

    if (!ngo_id) {
      return NextResponse.json({ error: "NGO ID is required" }, { status: 400 });
    }

    // Get the application to check event ownership
    const application = await getApplicationById(id);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Check if the event belongs to the NGO
    const event = await getEventById(application.event_id);
    if (!event || event.ngo_id !== ngo_id) {
      return NextResponse.json(
        { error: "Unauthorized: This NGO does not own the event" },
        { status: 403 }
      );
    }

    const updatedApplication = await updateApplicationStatus(id, status);
    return NextResponse.json(updatedApplication);
  } catch (error) {
        const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Remove a volunteer application
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    await deleteApplication(id);
    return NextResponse.json({ message: "Application deleted successfully" });
  } catch (error) {
        const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
