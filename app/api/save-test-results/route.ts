import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST(req: NextRequest) {
  const { userId, score, questions, timed, tutor, questionMode, newQuestions } =
    await req.json();

  if (
    !userId ||
    score === undefined ||
    !questions ||
    timed === undefined ||
    tutor === undefined ||
    questionMode === undefined ||
    !newQuestions
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
      INSERT INTO test_history (user_id, score, questions, timed, tutor, questionMode, new_questions)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      userId,
      score,
      questions,
      timed,
      tutor,
      questionMode,
      newQuestions,
    ];

    const result = await client.query(query, values);
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error saving test result:", error);
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
