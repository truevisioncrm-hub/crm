import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getPFListings } from '@/lib/propertyfinder';

export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        // Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const perPage = searchParams.get('perPage') || '50';

        const data = await getPFListings({ page, perPage });

        return NextResponse.json(data);
    } catch (err: any) {
        console.error('[PF Listings API]', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
