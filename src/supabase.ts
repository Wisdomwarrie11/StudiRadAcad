import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = "https://nggnuxsjbljpnvjiiaul.supabase.co";
const supabaseAnonKey: string = "sb_publishable_nckjfpcl4ci0UdQBrfMp7w_NmPtLcOZ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
