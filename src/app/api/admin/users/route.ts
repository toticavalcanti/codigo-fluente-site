import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify if requester is superuser
    const token = request.cookies.get('cf-admin-token')?.value;
    if (!token) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    
    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'superuser') {
      return NextResponse.json({ message: 'Apenas superusers podem criar administradores' }, { status: 403 });
    }

    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios' }, { status: 400 });
    }

    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Este e-mail já está em uso' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role: 'admin',
      createdBy: decoded.email
    });

    await newUser.save();

    return NextResponse.json({ 
      message: 'Novo administrador criado com sucesso',
      user: { email: newUser.email, name: newUser.name, role: newUser.role }
    }, { status: 201 });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}
