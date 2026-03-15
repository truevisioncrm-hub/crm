import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json()
        const supabase = await createClient()

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 401 })
        }

        if (data.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .maybeSingle()

            return NextResponse.json({
                success: true,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    role: profile?.role
                }
            })
        }

        return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 })
    } catch (err) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
