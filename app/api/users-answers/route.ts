import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// post user answers
export async function POST(req: NextRequest) {
  const { user_id, question_id, selected_answer, is_correct, test_history_id } =
    await req.json();

  // Add logging to see if the test_history_id is being passed correctly
  console.log("Received data:", {
    user_id,
    question_id,
    selected_answer,
    is_correct,
    test_history_id,
  });

  if (
    !user_id ||
    !question_id ||
    selected_answer === undefined ||
    is_correct === undefined ||
    !test_history_id
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  let client;
  try {
    client = await pool.connect();
    const query = `
      INSERT INTO user_answers (user_id, question_id, selected_answer, is_correct, test_history_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const values = [
      user_id,
      question_id,
      selected_answer,
      is_correct,
      test_history_id,
    ];

    console.log("Executing query to insert user answer:", { values });

    const result = await client.query(query, values);

    console.log("Insert result:", result.rows[0]);

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

// get user answers
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
      SELECT 
        ua.id, 
        ua.user_id, 
        ua.question_id, 
        ua.selected_answer, 
        ua.is_correct, 
        ua.answered_at, 
        ua.test_history_id, 
        q.question_text,
        q.answer1,
        q.answer2,
        q.answer3,
        q.answer4,
        q.comments,
        q.correct_answer, 
        s.name AS subject
      FROM user_answers ua
      JOIN questions q ON ua.question_id = q.id
      JOIN subjects s ON q.subject_id = s.id
      WHERE ua.test_history_id = $1;
    `;
    const values = [testHistoryId];

    const result = await client.query(query, values);
    client.release();

    console.log("Fetched user answers:", result.rows);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "No user answers found for the given test_history_id" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching user answers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
