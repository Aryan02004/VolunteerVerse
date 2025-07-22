import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET: Check if a volunteer has already applied for an event
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("event_id");
    const volunteerId = url.searchParams.get("volunteer_id");

    if (!eventId || !volunteerId) {
      return NextResponse.json(
        { error: "Event ID and Volunteer ID are required" },
        { status: 400 }
      );
    }

    // Check if application exists
    const { data, error } = await supabase
      .from("volunteer_applications")
      .select("id")
      .eq("event_id", eventId)
      .eq("volunteer_id", volunteerId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ exists: !!data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}