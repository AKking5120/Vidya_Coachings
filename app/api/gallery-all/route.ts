import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// Returns all published gallery photos ordered newest first.
// The gallery page fetches this once and paginates client-side.
export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('gallery')
    .select('id, src, alt, category')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? [], {
    headers: {
      // Cache for 60 seconds on CDN — photos don't change every second
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
