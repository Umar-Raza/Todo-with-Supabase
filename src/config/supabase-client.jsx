import { createClient } from "@supabase/supabase-js";

const supabaseKey = import.meta.env.VITE_APP_SUPABASE_key;
const supabaseURL = import.meta.env.VITE_APP_SUPABASE_appURL;
const supabase = createClient(supabaseURL, supabaseKey)

export default supabase
