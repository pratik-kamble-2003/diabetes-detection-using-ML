
import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST() {
    try {
        await deleteSession();
        return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
    } catch (error) {
        console.error('Logout Error:', error);
        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}
