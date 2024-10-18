import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET(req: NextRequest) {
  let client;
  try {
    client = await pool.connect();

    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Verify the session token
    const sessionData = await verifyToken(sessionCookie.value);
    if (
      !sessionData ||
      !sessionData.user ||
      typeof sessionData.user.id !== 'number' ||
      new Date(sessionData.expires) < new Date()
    ) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Fetch the user from the database
    
    const query = `
      SELECT id, name, email, role, created_at, updated_at, deleted_at
      FROM users
      WHERE id = $1
      AND deleted_at IS NULL
      LIMIT 1;
    `;
    // console.log("Executing query to fetch the user");
    const result = await client.query(query, [sessionData.user.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    // Return the user data
    // console.log(result.rows[0]);
    return NextResponse.json({ user: result.rows[0] });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function POST(req: NextRequest) {
  let client;
  try {
    client = await pool.connect();
    const query = `
      SELECT id, name, email, role, created_at, updated_at, deleted_at
      FROM users;
    `;

    console.log("Executing query to fetch all users");

    const result = await client.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}
