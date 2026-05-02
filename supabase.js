import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uwpcfptwkxqypbkbbjnb.supabase.co'
const supabaseKey = 'sb_publishable_YA60CLDV3UUrOtD8JMQVkg_mLmEtg3Z'

export const supabase = createClient(supabaseUrl, supabaseKey)