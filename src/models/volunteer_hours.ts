import { supabase } from "@/lib/supabaseClient";

// Get all volunteer hours
export const getVolunteerHours = async () => {
  const { data, error } = await supabase
    .from("volunteer_hours")
    .select(
      "id, volunteer_id, event_id, hours_logged, verified, verified_by,is_generated, logged_at"
    );
  if (error) throw new Error(error.message);
  return data;
};

// Get a single volunteer hours log by ID
export const getVolunteerHoursById = async (id: string) => {
  const { data, error } = await supabase
    .from("volunteer_hours")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Log new volunteer hours
export const logVolunteerHours = async (entry: {
  volunteer_id: string;
  event_id: string;
  hours_logged: number;
}) => {
  const { data, error } = await supabase
    .from("volunteer_hours")
    .insert([entry])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Verify volunteer hours (Only the NGO of the event can verify)
export const verifyVolunteerHours = async (id: string, verified_by: string) => {
  // Get event_id for the log
  const { data: log, error: logError } = await supabase
    .from("volunteer_hours")
    .select("event_id")
    .eq("id", id)
    .single();

  if (logError || !log) throw new Error("Volunteer hours log not found");

  // Get NGO ID from the event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("ngo_id")
    .eq("id", log.event_id)
    .single();

  if (eventError || !event) throw new Error("Event not found");

  // Fetch the user_id from the NGOs table using ngo_id
  const { data: ngo, error: ngoError } = await supabase
    .from("ngos")
    .select("user_id")
    .eq("id", event.ngo_id)
    .single();

  if (ngoError || !ngo) throw new Error("NGO not found");

  // Fetch the role of the user from the users table
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", ngo.user_id)
    .single();

  if (userError || !user) throw new Error("User not found or role missing");

  // Ensure that the user verifying the hours is the NGO that created the event
  if (ngo.user_id !== verified_by) {
    throw new Error(
      "Unauthorized: Only the NGO managing the event can verify hours"
    );
  }

  // Update the volunteer hours log
  const { data, error } = await supabase
    .from("volunteer_hours")
    .update({ verified: true, verified_by })
    .eq("id", id)
    .eq("verified", false) // Ensure it's not already verified
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Delete volunteer hours entry
export const deleteVolunteerHours = async (id: string) => {
  const { error } = await supabase
    .from("volunteer_hours")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
};
