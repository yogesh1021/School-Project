import { NextResponse } from "next/server";
import { getDBPool } from "@/backend/db";
import cloudinary from "@/backend/cloudinary";

export const runtime = "nodejs"; // required for mysql2 + cloudinary

// GET /api/schools
export async function GET() {
  try {
    const pool = getDBPool();
    const [rows] = await pool.query(
      "SELECT id, name, address, city, state, contact, image AS image_url, email_id, image_public_id FROM schools ORDER BY id DESC"
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/schools", err);
    return NextResponse.json({ error: "Failed to fetch schools" }, { status: 500 });
  }
}

// POST /api/schools
export async function POST(req) {
  try {
    const form = await req.formData();

    const name = (form.get("name") || "").trim();
    const address = (form.get("address") || "").trim();
    const city = (form.get("city") || "").trim();
    const state = (form.get("state") || "").trim();
    const contact = (form.get("contact") || "").trim();
    const email_id = (form.get("email_id") || "").trim();
    const file = form.get("image");

    if (!name || !address || !city || !state || !contact || !email_id || !file) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!/^\d{10}$/.test(contact)) {
      return NextResponse.json({ error: "Contact must be 10 digits." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email_id)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    if (typeof file === "string" || !file) {
      return NextResponse.json({ error: "Image file missing." }, { status: 400 });
    }
    if (!file.type?.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "schools", resource_type: "image", use_filename: true, unique_filename: true, overwrite: false },
          (err, res) => (err ? reject(err) : resolve(res))
        )
        .end(buffer);
    });

    const imageUrl = uploadResult.secure_url;
    const publicId = uploadResult.public_id;

    // Save to DB
    const pool = getDBPool();
    await pool.query(
      `INSERT INTO schools (name, address, city, state, contact, image, email_id, image_public_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, address, city, state, Number(contact), imageUrl, email_id, publicId]
    );

    return NextResponse.json({ ok: true, image_url: imageUrl, public_id: publicId });
  } catch (err) {
    console.error("POST /api/schools", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
