import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('downloads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const { title, category, class_label, file_url, file_type } = body as {
    title?: string; category?: string; class_label?: string; file_url?: string; file_type?: string;
  };
  if (!title?.trim() || !category || !file_url?.trim())
    return NextResponse.json({ error: 'title, category, file_url required' }, { status: 400 });
  const supabase = createServerClient();
  const { data, error } = await supabase.from('downloads').insert({
    title: title.trim(),
    category: ['notes', 'circulars'].includes(category) ? category : 'notes',
    class_label: class_label?.trim() ?? '',
    file_url: file_url.trim(),
    file_type: file_type ?? 'pdf',
    published: true,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json().catch(() => ({} as { id?: number }));
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const supabase = createServerClient();
  const { error } = await supabase.from('downloads').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
