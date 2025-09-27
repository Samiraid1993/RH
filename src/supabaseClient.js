import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zcbzlczupnwsdfngolca.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjYnpsY3p1cG53c2RmbmdvbGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NzkzOTEsImV4cCI6MjA3NDU1NTM5MX0.WtEDMB9buLbo0YZqyxBWNRPNoTqhwMpMiGpJ_K_ihy4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
