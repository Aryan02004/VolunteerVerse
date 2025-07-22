import { supabase } from "@/lib/supabaseClient";

// Get all volunteer applications
export async function getApplications() {
  const { data, error } = await supabase
    .from("volunteer_applications")
    .select("*");

  if (error) throw new Error(error.message);
  return data;
}

// Get a volunteer application by ID
export async function getApplicationById(id: string) {
  const { data, error } = await supabase
    .from("volunteer_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Get all applications for a specific event
export const getApplicationsByEvent = async (event_id: string) => {
  const { data, error } = await supabase
    .from("volunteer_applications")
    .select("id, event_id, volunteer_id, status, applied_at")
    .eq("event_id", event_id);

  if (error) throw new Error(error.message);
  return data;
};

// Create a new volunteer application
export async function createApplication({ event_id, volunteer_id }: { event_id: string, volunteer_id: string }) {
  // First check if application already exists
  const { data: existingData, error: checkError } = await supabase
    .from("volunteer_applications")
    .select("id")
    .eq("event_id", event_id)
    .eq("volunteer_id", volunteer_id)
    .maybeSingle();

  if (checkError) throw new Error(checkError.message);
  
  // If application already exists, return it
  if (existingData) {
    return existingData;
  }

  // Otherwise, create a new application
  const { data, error } = await supabase
    .from("volunteer_applications")
    .insert({
      event_id,
      volunteer_id,
      status: "pending"
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating application:", error);
    throw new Error(error.message);
  }
  
  return data;
}

// Update an application's status (Only NGOs should be able to do this)
export const updateApplicationStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected"
) => {
  const { data, error } = await supabase
    .from("volunteer_applications")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Delete a volunteer application
export const deleteApplication = async (id: string) => {
  const { error } = await supabase
    .from("volunteer_applications")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export async function getApplicationsByVolunteer(volunteer_id: string) {
  const { data, error } = await supabase
    .from("volunteer_applications")
    .select("*, event:events(*)")
    .eq("volunteer_id", volunteer_id);

  if (error) throw new Error(error.message);
  return data;
}
