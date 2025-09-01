import { NextResponse } from 'next/server';
import { getDBPool } from '@/backend/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET /api/schools
export async function GET() {
  try {
    const pool = getDBPool();
    const [rows] = await pool.query(
      'SELECT id, name, address, city, state, contact, image, email_id FROM schools ORDER BY id DESC'
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error('GET /api/schools', err);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}

// POST /api/schools  
export async function POST(req) {
  try {
    const form = await req.formData();

    const name = (form.get('name') || '').trim();
    const address = (form.get('address') || '').trim();
    const city = (form.get('city') || '').trim();
    const state = (form.get('state') || '').trim();
    const contact = (form.get('contact') || '').trim();
    const email_id = (form.get('email_id') || '').trim();
    const file = form.get('image');

    // minimal checks
    if (!name || !address || !city || !state || !contact || !email_id || !file) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!/^\d{10}$/.test(contact)) {
      return NextResponse.json({ error: 'Contact must be 10 digits.' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email_id)) {
      return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
    }
    if (typeof file === 'string') {
      return NextResponse.json({ error: 'Image file missing.' }, { status: 400 });
    }

    // save under /public/schoolImages
    const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const fileName = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const imagePath = `/schoolImages/${fileName}`;

    const pool = getDBPool();
    await pool.query(
      `INSERT INTO schools (name, address, city, state, contact, image, email_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, address, city, state, Number(contact), imagePath, email_id]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/schools', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

export const runtime = 'nodejs'; 
