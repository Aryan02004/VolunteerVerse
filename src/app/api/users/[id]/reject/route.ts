import { NextResponse } from "next/server";
import { updateUser } from "@/models/users";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedUser = await updateUser(id, { is_approved: false });
    return NextResponse.json(updatedUser);
  } catch (error) {
        console.error("User creation error:", error);
    return NextResponse.json(
      { error: "Failed to reject NGO" },
      { status: 500 }
    );
  }
} 