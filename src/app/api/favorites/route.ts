import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
    const supabase = await createClient(); 
    const { data: { user } } = await supabase.auth.getUser(); 
    if (!user) {
        return NextResponse.json({ error: 'Nu esti autentificat.' }, { status: 401 });
    }

    const body = await req.json();
    const { place_id, name, address, photo_reference, google_maps_url, website } = body;

    //Inserarea locației în tabelul 'favorites'
    const { data, error } = await supabase
        .from('favorites')
        .insert([{
            user_id: user.id,
            place_id,
            name,
            address,
            photo_reference,
            google_maps_url,
            website,
        }]);
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
}
