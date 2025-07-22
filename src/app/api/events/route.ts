import { NextResponse } from "next/server";
import { getEvents, createEvent } from "@/models/events";
import { getNgoById } from "@/models/ngos"; // To validate ownership

// GET: Fetch all events
export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events);
  } catch (error) {
        const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Create a new event (Only the NGO owner can create)
export async function POST(req: Request) {
  try {
    const eventData = await req.json();
    
    // Validate required fields
    if (!eventData.ngo_id) {
      return NextResponse.json({ error: "NGO ID is required" }, { status: 400 });
    }
    
    if (!eventData.title || !eventData.event_date || !eventData.category || !eventData.hours_required) {
      return NextResponse.json({ 
        error: "Missing required fields",
        received: {
          ngo_id: eventData.ngo_id,
          title: eventData.title,
          event_date: eventData.event_date,
          category: eventData.category,
          hours_required: eventData.hours_required
        }
      }, { status: 400 });
    }

    // Validate that the NGO exists
    const ngo = await getNgoById(eventData.ngo_id);
    if (!ngo) {
      return NextResponse.json({ 
        error: "NGO not found", 
        ngo_id: eventData.ngo_id 
      }, { status: 404 });
    }

    const newEvent = await createEvent(eventData);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Event creation error:', error);
        const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ 
      error: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
    }, { status: 500 });
  }
}
