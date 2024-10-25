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
      return NextResponse.json({ subscription: null }, { status: 401 });
    }

    // Verify the session token
    const sessionData = await verifyToken(sessionCookie.value);
    if (
      !sessionData ||
      !sessionData.user ||
      typeof sessionData.user.id !== 'number' ||
      new Date(sessionData.expires) < new Date()
    ) {
      return NextResponse.json({ subscription: null }, { status: 401 });
    }

    const query = `
      SELECT users.*, teams.*
      FROM users
      LEFT JOIN team_members ON users.id = team_members.user_id
      LEFT JOIN teams ON team_members.team_id = teams.id
      WHERE users.id = $1
      LIMIT 1;
    `;
    const result = await client.query(query, [sessionData.user.id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ subscription: null }, { status: 404 });
    }

    // Return the data
    return NextResponse.json({ subscription: result.rows[0].stripe_subscription_id });

  } catch (error) {
    console.error("Error fetching user subscription:", error);
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