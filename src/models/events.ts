import { supabase } from "@/lib/supabaseClient";

interface Event {
  ngo_id: string;
  title: string;
  description?: string;
  location?: string;
  event_date: string;
  duration?: number;
  requirements?: string;
  max_volunteers?: number;
  event_image_url?: string;
  category: string;
  hours_required: number;
}

export const getEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      location,
      event_date,
      duration,
      category,
      max_volunteers,
      event_image_url,
      hours_required,
      created_at,
      ngo:ngos(name)
    `)
    .order('event_date', { ascending: true })
    .limit(50); // Add pagination limit

  if (error) throw error;
  return data;
};

export const getEventById = async (id: string) => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createEvent = async (eventData: Event) => {
  const { data, error } = await supabase
    .from("events")
    .insert([eventData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateEvent = async (id: string, updates: Partial<Event>) => {
  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
