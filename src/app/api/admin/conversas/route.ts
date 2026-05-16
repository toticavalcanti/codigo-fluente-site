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

    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');
    const filter = searchParams.get('filter') || 'all';

    if (sessionId) {
      const session = await db.collection('neo_sessions').findOne({ session_id: sessionId });
      if (!session) {
        return NextResponse.json({ message: 'Sessão não encontrada' }, { status: 404 });
      }
      return NextResponse.json({ session });
    }

    let query: any = {};
    if (filter === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      query.updated_at = { $gte: startOfDay.toISOString() }; // Assuming ISO string is stored, or Date object?
    } else if (filter === 'week') {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      query.updated_at = { $gte: startOfWeek.toISOString() };
    }

    // Usually python stores ISODate in MongoDB if using pymongo with datetime, or simple ISO string.
    // If it's a string, string comparison works fine for ISO 8601. 
    // If it's Date, we might need new Date() instead of .toISOString() but let's check how the professor_agent.py saves it later if it fails.
    // Actually, comparing string ISODates works well in MongoDB too.

    // Let's support both string and Date by using $gte with string and Date objects?
    // Let's try ISO string first, if that's how it's saved. Or better, just construct dates and let mongo do its magic.
    let finalQuery: any = {};
    if (filter === 'today') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        finalQuery = { 
            $or: [
                { updated_at: { $gte: startOfDay } },
                { updated_at: { $gte: startOfDay.toISOString() } }
            ]
        };
    } else if (filter === 'week') {
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        finalQuery = { 
            $or: [
                { updated_at: { $gte: startOfWeek } },
                { updated_at: { $gte: startOfWeek.toISOString() } }
            ]
        };
    }

    const sessions = await db.collection('neo_sessions')
      .find(finalQuery)
      .sort({ updated_at: -1 })
      .toArray();

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Fetch neo sessions error:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}
