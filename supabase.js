import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://SEU_PROJETO.supabase.co",
  "SUA_ANON_KEY"
);
