import { NextResponse } from "next/server";
import { getUsers, createUser } from "@/models/users";
// import bcrypt from "bcrypt"; // Commented out for now

// GET: Fetch all users (restricted to admin)
export async function GET(req: Request) {
  try {
    const isAdmin = true; // Replace with actual admin check

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    // Get the role filter from URL parameters
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');

    const users = await getUsers();
    
    // Filter users by role if specified
    const filteredUsers = role ? users.filter(user => user.role === role) : users;
    
    return NextResponse.json(filteredUsers);
  } catch (error) {
        console.error("User creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new user (signup)
export async function POST(req: Request) {
  try {
    const { first_name, last_name, email, password, role, profile_image_url } = await req.json();

    if (!first_name || !last_name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // const password_hash = await bcrypt.hash(password, 10); // Temporarily disabled hashing
    const password_hash = password; // Storing password as plain text for now

    const is_approved = role === "volunteer"; // Automatically approve volunteers

    const newUser = await createUser({
      first_name,
      last_name,
      email,
      password_hash,
      role,
      profile_image_url,
      is_approved, // Include the approval status
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

