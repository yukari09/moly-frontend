import { NextResponse } from 'next/server';
import * as gql from '@/lib/graphql';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    await gql.verifyConfirmToken('confirm_new_user', token);
    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}