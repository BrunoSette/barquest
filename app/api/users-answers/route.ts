import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

//post user answers
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

//get user answers
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const testHistoryId = searchParams.get("test_history_id");

  if (!testHistoryId) {
    return NextResponse.json(
      { error: "Missing test_history_id" },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    const query = `
      SELECT ua.*, q.question_text, q.correct_answer, s.name AS subject
      FROM user_answers ua
      JOIN questions q ON ua.question_id = q.id
      JOIN subjects s ON q.subject_id = s.id
      WHERE ua.test_history_id = $1;
    `;
    const values = [testHistoryId];

    const result = await client.query(query, values);
    client.release();

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching user answers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
