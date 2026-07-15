import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { name, phone, email, message } = body as {
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
  };

  if (!name?.trim() || !phone?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: 'name, phone, and message are required' },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  const { error } = await supabase.from('contacts').insert({
    name: name.trim().slice(0, 150),
    phone: phone.trim().slice(0, 20),
    email: email?.trim().slice(0, 200) ?? null,
    message: message.trim().slice(0, 600),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: 'Message sent successfully' });
}
