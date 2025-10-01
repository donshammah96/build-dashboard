import { NextResponse } from 'next/server';
import { getSqlClient } from '../lib/db';

export async function GET() {
  try {
    const sql = getSqlClient();
    
    // Get all users from database
    const users = await sql`SELECT id, first_name, last_name, email, role FROM users`;
    
    return NextResponse.json({ 
      message: 'Current users in database',
      users: users,
      total_count: users.length,
      login_help: 'Use any of these email addresses with password: 123456'
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch users', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
