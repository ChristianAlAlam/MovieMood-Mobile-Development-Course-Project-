import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mqpipzanqmpberbvemfm.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcGlwemFucW1wYmVyYnZlbWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMzYzNzAsImV4cCI6MjA4MDYxMjM3MH0.tbPpygUi5qMemYcGGmtp5VUjl7iv3KCvCDyoDNE6FPY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
