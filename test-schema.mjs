import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nqerfbguvrmvqomsnjfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZXJmYmd1dnJtdnFvbXNuamZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTYxMjcsImV4cCI6MjA4NzIzMjEyN30.Khk9kYaCcDr1DkNVgs2TQoouyptgIOOx-iCv_Uu8KfE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const { data, error } = await supabase.from('properties').select('*').limit(1);
    if (error) console.error(error);
    else if (data && data.length > 0) console.log(Object.keys(data[0]));
    else console.log('No rows found, cannot infer schema this way');
}

checkSchema();
