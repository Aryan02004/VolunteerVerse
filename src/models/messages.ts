import { supabase } from "@/lib/supabaseClient";

// Get messages between two users
export const getMessages = async (sender_id: string, receiver_id: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}`)
    .order("sent_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// Send a new message
export const sendMessage = async (entry: {
  sender_id: string;
  receiver_id: string;
  content: string;
}) => {
  const { data, error } = await supabase
    .from("messages")
    .insert([entry])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Mark a message as read
export const markMessageAsRead = async (id: string) => {
  const { data, error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Delete a message
export const deleteMessage = async (id: string) => {
  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) throw new Error(error.message);
};
