import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://yciwipvxnjrtovcwctqh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljaXdpcHZ4bmpydG92Y3djdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTUzMjgsImV4cCI6MjA4ODczMTMyOH0.WVARILvy5Fm-Ez95DQuOhxpNQ356iZmUF35xlFw-Gmo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const STORAGE_BUCKET = 'card-media'
