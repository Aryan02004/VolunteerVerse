import { supabase } from "@/lib/supabaseClient";

// Get all volunteer users (restrict sensitive info)
export const getVolunteerUsers = async () => {
  const { data, error } = await supabase
    .from("volunteer_users")
    .select(
      "id, first_name, last_name, email, phone, user_type, university, roll_number, industry, occupation, is_approved, created_at"
    );

  if (error) throw new Error("Failed to fetch volunteer users");
  return data;
};

// Get volunteer user by ID
export const getVolunteerUserById = async (id: string) => {
  const { data, error } = await supabase
    .from("volunteer_users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error("Volunteer user not found");
  return data;
};

// Update volunteer user
export const updateVolunteerUser = async (
  id: string,
  updates: Partial<{
    first_name: string;
    last_name: string;
    phone: string;
    university: string;
    roll_number: string;
    student_email: string;
    industry: string;
    occupation: string;
    work_email: string;
    is_approved: boolean;
  }>
) => {
  const { data, error } = await supabase
    .from("volunteer_users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error("Error updating volunteer user");
  return data;
};

// Delete volunteer user
export const deleteVolunteerUser = async (id: string) => {
  const { error } = await supabase
    .from("volunteer_users")
    .delete()
    .eq("id", id);

  if (error) throw new Error("Error deleting volunteer user");
  return true;
};