import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Connect to DB
    await dbConnect();

    // Parse request body
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    // Create session (sets cookie internally)
    await createSession(user._id.toString());

    // Success response
    return NextResponse.json(
      {
        message: 'Login successful',
        userId: user._id,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Login Error:', error);

    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}