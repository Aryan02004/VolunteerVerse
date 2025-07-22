import { NextResponse } from "next/server";
import { getNgos, getNgosByUserId, createNgo } from "@/models/ngos";

// GET: Fetch all NGOs or NGOs by user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    let ngos;
    if (user_id) {
      ngos = await getNgosByUserId(user_id); // Fetch NGOs for a specific user
    } else {
      ngos = await getNgos();
    }

    return NextResponse.json(ngos);
  } catch (error) {
        const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Create a new NGO (Requires user_id)
export async function POST(req: Request) {
  try {
    const {
      user_id,
      name,
      description,
      website_url,
      contact_email,
      contact_phone,
      logo_url,
    } = await req.json();

    if (!user_id || !name) {
      return NextResponse.json(
        { error: "User ID and Name are required" },
        { status: 400 }
      );
    }

    // Attempt to create the NGO
    const newNgo = await createNgo({
      user_id,
      name,
      description,
      website_url,
      contact_email,
      contact_phone,
      logo_url,
    });

    return NextResponse.json(newNgo, { status: 201 });
  } catch (error) {
        const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    if (errorMessage.includes("You already have an NGO with this name.")) {
      return NextResponse.json({ error: errorMessage }, { status: 409 }); // 409 Conflict
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
