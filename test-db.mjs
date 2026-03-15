import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nqerfbguvrmvqomsnjfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZXJmYmd1dnJtdnFvbXNuamZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTYxMjcsImV4cCI6MjA4NzIzMjEyN30.Khk9kYaCcDr1DkNVgs2TQoouyptgIOOx-iCv_Uu8KfE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    // Try inserting with property_type = 'Sell' to test if the CHECK constraint is active
    // We need an org_id, let's fetch one first
    const { data: orgs } = await supabase.from('organizations').select('id').limit(1);
    if (!orgs || orgs.length === 0) { console.log('No orgs found'); return; }
    const orgId = orgs[0].id;

    console.log("Testing insert with property_type = 'Sell'...");
    const { data: d1, error: e1 } = await supabase.from('properties').insert([{
        org_id: orgId,
        title: 'Test',
        location: 'Test Loc',
        price: 1000,
        property_type: 'Sell'
    }]);
    console.log("Result 1:", e1 ? e1.message : 'Success');

    console.log("Testing insert with property_type = 'villa' and features = {type: 'Sell'}...");
    const { data: d2, error: e2 } = await supabase.from('properties').insert([{
        org_id: orgId,
        title: 'Test',
        location: 'Test Loc',
        price: 1000,
        property_type: 'villa',
        features: { category_type: 'Sell' }
    }]);
    console.log("Result 2:", e2 ? e2.message : 'Success');
}

testInsert();
