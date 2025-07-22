import { NextResponse } from "next/server";
import { getApplicationsByEvent } from "@/models/volunteer_applications";

// GET: Fetch all applications for a specific event
export async function GET(req: Request, context: { params: Promise<{ event_id: string }> }) {
  try {
    const { event_id } = await context.params;

    if (!event_id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const applications = await getApplicationsByEvent(event_id);
    return NextResponse.json(applications);
  } catch (error) {
        const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
