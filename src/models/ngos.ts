import { supabase } from "@/lib/supabaseClient";

// Get all NGOs
export const getNgos = async () => {
  const { data, error } = await supabase
    .from("ngos")
    .select(
      "id, user_id, name, description, website_url, contact_email, contact_phone, logo_url, created_at"
    );

  if (error) throw new Error(error.message);
  return data;
};

// Get an NGO by ID
export const getNgoById = async (id: string) => {
  const { data, error } = await supabase
    .from("ngos")
    .select(
      "id, user_id, name, description, website_url, contact_email, contact_phone, logo_url, created_at"
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Create a new NGO (must include user_id)
export const createNgo = async (ngo: {
  user_id: string;
  name: string;
  description?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
}) => {
  // Check if an NGO with the same name already exists for the user
  const { data: existingNgo, error: checkError } = await supabase
    .from("ngos")
    .select("id")
    .eq("user_id", ngo.user_id)
    .eq("name", ngo.name)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 = no rows found (safe to proceed)
    throw new Error(checkError.message);
  }

  if (existingNgo) {
    throw new Error("You already have an NGO with this name.");
  }

  // Insert the new NGO
  const { data, error } = await supabase.from("ngos").insert([ngo]).select().single();

  if (error) throw new Error(error.message);
  return data;
};

// Update an NGO (prevent user_id update)
export const updateNgo = async (
  id: string,
  updates: Partial<{
    name: string;
    description?: string;
    website_url?: string;
    contact_email?: string;
    contact_phone?: string;
    logo_url?: string;
  }>
) => {
  const { data, error } = await supabase
    .from("ngos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Delete an NGO (check user_id first)
export const deleteNgo = async (id: string, userId: string) => {
  // Check if the requesting user is the owner or an admin
  const { data: ngo, error: findError } = await supabase
    .from("ngos")
    .select("user_id")
    .eq("id", id)
    .single();

  if (findError) throw new Error(findError.message);

  if (!ngo || ngo.user_id !== userId) {
    throw new Error("Unauthorized: Only the NGO owner can delete this NGO.");
  }

  const { error } = await supabase.from("ngos").delete().eq("id", id);

  if (error) throw new Error(error.message);
};

// Get all NGOs owned by a specific user
export const getNgosByUserId = async (user_id: string) => {
  const { data, error } = await supabase
    .from("ngos")
    .select("id, name, description, website_url, contact_email, contact_phone, logo_url, created_at")
    .eq("user_id", user_id); // Fetch NGOs only for this user

  if (error) throw new Error(error.message);
  return data;
};

// Get an NGO by user ID
export const getNgoByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("ngos")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};
