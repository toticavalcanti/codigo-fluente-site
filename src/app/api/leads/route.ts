import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Lead } from '@/models/Lead';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, source, category, post_slug } = body;

    if (!name || !email || !source) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 });
    }

    // Validação de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Rate limiting simples: verificar se o mesmo email já existe para esta fonte
    const existing = await Lead.findOne({ email, source });
    if (existing) {
      return NextResponse.json({ message: 'Lead já cadastrado', success: true }, { status: 200 });
    }

    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    const lead = await Lead.create({
      name,
      email,
      source,
      category,
      post_slug,
      ip
    });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error: any) {
    console.error('Lead API Error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
