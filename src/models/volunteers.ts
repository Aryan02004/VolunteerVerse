import { supabase } from "@/lib/supabaseClient";

export const getVolunteerById = async (id: string) => {
  const { data, error } = await supabase
    .from("volunteer_users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const getVolunteers = async () => {
  const { data, error } = await supabase
    .from("volunteer_users")
    .select("*");

  if (error) throw error;
  return data;
};