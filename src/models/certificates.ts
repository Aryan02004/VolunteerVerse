import { supabase } from "@/lib/supabaseClient";

// Get all certificates
export const getCertificates = async () => {
  const { data, error } = await supabase
    .from("certificates")
    .select("id, volunteer_id, event_id, ngo_id, certificate_url, issued_at");

  if (error) throw new Error(error.message);
  return data;
};

// Get a certificate by ID
export const getCertificateById = async (id: string) => {
  const { data, error } = await supabase
    .from("certificates")
    .select("id, volunteer_id, event_id, ngo_id, certificate_url, issued_at")
    .eq("id", id)
    .single();

  if (error) throw new Error("Certificate not found");
  return data;
};

// Issue a new certificate
export const issueCertificate = async (entry: {
  volunteer_id: string;
  event_id: string;
  ngo_id: string;
}) => {
  const { data, error } = await supabase
    .from("certificates")
    .insert([entry])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Delete a certificate entry
export const deleteCertificate = async (id: string) => {
  const { error } = await supabase.from("certificates").delete().eq("id", id);

  if (error) throw new Error(error.message);
};
