import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { student_name, class: cls, parent_name, phone, email, message } = body as {
    student_name?: string;
    class?: string;
    parent_name?: string;
    phone?: string;
    email?: string;
    message?: string;
  };

  if (!student_name?.trim() || !cls?.trim() || !parent_name?.trim() || !phone?.trim()) {
    return NextResponse.json(
      { error: 'student_name, class, parent_name, and phone are required' },
      { status: 400 }
    );
  }

  const supabase = createServerClient();
  const { error } = await supabase.from('admissions').insert({
    student_name: student_name.trim().slice(0, 150),
    class: cls.trim().slice(0, 50),
    parent_name: parent_name.trim().slice(0, 150),
    phone: phone.trim().slice(0, 20),
    email: email?.trim().slice(0, 200) ?? null,
    message: message?.trim().slice(0, 600) ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: 'Admission enquiry submitted successfully' });
}
