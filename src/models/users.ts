import { supabase } from "@/lib/supabaseClient";

// Get all users (restrict sensitive info)
export const getUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, first_name, last_name, email, role, profile_image_url, created_at,is_approved"
    );

  if (error) throw new Error("Failed to fetch users");
  return data;
};

// Get user by ID (restrict sensitive info)
export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, first_name, last_name, email, role, profile_image_url, created_at,is_approved"
    )
    .eq("id", id)
    .single();

  if (error) throw new Error("User not found");
  return data;
};

// Create a new user (secure)
export const createUser = async (user: {
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: "volunteer" | "ngo" | "admin";
  profile_image_url?: string;
  is_approved: boolean;
}) => {
  const { data, error } = await supabase
    .from("users")
    .insert([user])
    .select()
    .single();

  if (error) throw new Error("Error creating user");
  return data;
};

// Update user (prevent role escalation)
export const updateUser = async (
  id: string,
  updates: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    role?: never; // Prevents updating role
    profile_image_url?: string;
    is_approved: boolean;
  }>
) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error("Error updating user");
  return data;
};

// Delete user (with restrictions)
export const deleteUser = async (id: string) => {
  const user = await getUserById(id);

  if (user.role === "admin") {
    throw new Error("Cannot delete an admin user");
  }

  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw new Error("Error deleting user");
};
