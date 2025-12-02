import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxtoscqihhiiqwjooaxj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4dG9zY3FpaGhpaXF3am9vYXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTg3NzUsImV4cCI6MjA4MDIzNDc3NX0.ktojd3daHvwn626h9BhzxLsBoWjBidFlnMYCM60APyU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
