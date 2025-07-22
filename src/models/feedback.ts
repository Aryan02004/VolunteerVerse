import { supabase } from "@/lib/supabaseClient";

// Get all feedback entries
export const getAllFeedbacks = async () => {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// Get feedback for a specific event
export const getFeedbackForEvent = async (event_id: string) => {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("event_id", event_id)
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// Get feedback by ID
export const getFeedbackById = async (id: string) => {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Submit feedback for an event
export const submitFeedback = async (entry: {
  event_id: string;
  volunteer_id: string;
  rating: number;
  comments?: string;
}) => {
  const { data, error } = await supabase
    .from("feedback")
    .insert([entry])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Delete feedback entry
export const deleteFeedback = async (id: string) => {
  const { error } = await supabase.from("feedback").delete().eq("id", id);

  if (error) throw new Error(error.message);
};
