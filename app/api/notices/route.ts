import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// GET — public: active notices only
export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST — admin: create notice
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { title, body: noticeBody, type } = body as {
    title?: string; body?: string; type?: string;
  };
  if (!title?.trim() || !noticeBody?.trim())
    return NextResponse.json({ error: 'title and body are required' }, { status: 400 });

  const supabase = createServerClient();
  const { data, error } = await supabase.from('notices').insert({
    title: title.trim(),
    body: noticeBody.trim(),
    type: ['info', 'warning', 'success', 'urgent'].includes(type ?? '') ? type : 'info',
    active: true,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — admin: deactivate (soft delete)
export async function DELETE(req: NextRequest) {
  const { id } = await req.json().catch(() => ({} as { id?: number }));
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const supabase = createServerClient();
  const { error } = await supabase.from('notices').update({ active: false }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
