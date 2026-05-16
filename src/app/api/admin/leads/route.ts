import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('cf-admin-token')?.value;
    if (!token) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    
    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Sessão inválida' }, { status: 401 });
    }

    const mongoose = await dbConnect();
    const db = mongoose.connection.db;
    
    if (!db) {
       throw new Error("Database not initialized");
    }

    const leads = await db.collection('neo_leads')
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Fetch neo leads error:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}
