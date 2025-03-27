import { supabase } from "../utils/supabaseClient";

const fetchSubscriptions = async () => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    throw error;
  }
  return data;
};

export default fetchSubscriptions;