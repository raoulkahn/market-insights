// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://upmshkfzhsvobptldewl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbXNoa2Z6aHN2b2JwdGxkZXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NDAwMDIsImV4cCI6MjA1NTIxNjAwMn0.zJ_bmffTqG1QMoCHvbuNbuxyKd-iXmhOR-pQpTiRvL0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);