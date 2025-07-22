import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client with admin privileges using the service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      userId,
      firstName,
      lastName,
      email,
      phone,
      userType,
      university,
      rollNumber,
      studentEmail,
      industry,
      occupation,
      workEmail,
      is_approved = true,
    } = data;

    // Validate required fields
    if (!userId || !firstName || !lastName || !email || !userType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Server: Inserting user data for ID:", userId);

    // Prepare data for insertion
    const volunteerData = {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      user_type: userType,
      // Conditional fields based on user type
      ...(userType === "student" && {
        university: university,
        roll_number: rollNumber,
        student_email: studentEmail || null,
      }),
      ...(userType === "professional" && {
        industry: industry,
        occupation: occupation,
        work_email: workEmail || null,
      }),
      is_approved: is_approved,
    };

    // Use the admin client to bypass RLS policies
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from("volunteer_users")
      .insert([volunteerData])
      .select();

    if (insertError) {
      console.error("Server: Error inserting user data:", insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    console.log("Server: User data inserted successfully:", insertData);
    return NextResponse.json({ success: true, data: insertData });
  } catch (error) {
    console.error("Server: Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}