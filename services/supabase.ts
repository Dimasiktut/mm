
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// ВСТАВЬТЕ ВАШИ ДАННЫЕ ИЗ SUPABASE DASHBOARD НИЖЕ
// ------------------------------------------------------------------
const SUPABASE_URL = 'https://lrunlhvrajrzsoffcwxm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxydW5saHZyYWpyenNvZmZjd3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMTk5MDEsImV4cCI6MjA4Njg5NTkwMX0.AqPLh7A6c_CtGSfrSovqYmrtT0qtABA3JNnjgQUwa4Y';
// ------------------------------------------------------------------

const isConfigured = SUPABASE_URL.includes('YOUR_PROJECT_ID') === false;

export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

export const isSupabaseConfigured = () => isConfigured;
