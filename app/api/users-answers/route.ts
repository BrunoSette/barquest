import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST(req: NextRequest) {
  const { user_id, question_id, selected_answer, is_correct } =
    await req.json();
  let client;
  try {
    client = await pool.connect();
    const query = `
      INSERT INTO user_answers (user_id, question_id, selected_answer, is_correct)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const values = [user_id, question_id, selected_answer, is_correct];

    console.log("Executing query to insert user answer");

    const result = await client.query(query, values);

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error("Error inserting user answer:", error);
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
