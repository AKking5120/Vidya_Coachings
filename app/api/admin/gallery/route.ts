import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const { src, alt, category } = body as { src?: string; alt?: string; category?: string };
  if (!src?.trim() || !category)
    return NextResponse.json({ error: 'src and category required' }, { status: 400 });
  const supabase = createServerClient();
  const { data, error } = await supabase.from('gallery').insert({
    src: src.trim(), alt: alt?.trim() ?? '', category, published: true,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json().catch(() => ({} as { id?: number }));
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const supabase = createServerClient();
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
