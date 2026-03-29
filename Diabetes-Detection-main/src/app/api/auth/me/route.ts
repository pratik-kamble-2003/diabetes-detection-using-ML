import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    // ✅ Get session
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ✅ Connect DB
    await dbConnect();

    // ✅ Fetch user
    const user = await UserModel.findById(session.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user },
      { status: 200 }
    );

  } catch (error) {
    console.error('Me Error:', error);

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}