import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const { data: user, error: authError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password_hash", password) // No hashing for now
      .single();

    if (authError || !user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!user.is_approved) {
      return NextResponse.json({ message: "Account pending approval" }, { status: 403 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
