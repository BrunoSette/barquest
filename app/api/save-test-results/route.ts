import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST(req: NextRequest) {
  const { userId, score, questions, timed, tutor, questionMode, newQuestions } =
    await req.json();

  // Validate that all required fields are provided
  if (
    !userId ||
    score === undefined ||
    questions === undefined ||
    timed === undefined ||
    tutor === undefined ||
    !questionMode ||
    newQuestions === undefined
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
      INSERT INTO test_history 
        (user_id, score, questions, timed, tutor, questionmode, new_questions, date)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
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

    // Respond with the inserted test history row
    return NextResponse.json(result.rows[0], { status: 201 }); // 201 for resource creation
  } catch (error) {
    console.error("Error saving test result:", (error as Error).message);

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

export async function PATCH(req: NextRequest) {
  const { userId, score, questions, timed, tutor, questionMode, newQuestions, testHistoryId } =
    await req.json();

  // Validate that all required fields are provided
  if (
    !userId ||
    !testHistoryId ||
    score === undefined ||
    questions === undefined ||
    timed === undefined ||
    tutor === undefined ||
    !questionMode ||
    newQuestions === undefined
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
      UPDATE test_history
      SET 
        score = $1, 
        questions = $2, 
        timed = $3, 
        tutor = $4, 
        questionmode = $5, 
        new_questions = $6, 
        date = CURRENT_TIMESTAMP
      WHERE 
        id = $7
      RETURNING *;
    `;

    const values = [
      score,
      questions,
      timed,
      tutor,
      questionMode,
      newQuestions,
      testHistoryId,
    ];

    const result = await client.query(query, values);

    return NextResponse.json({ status: 204 });
  } catch (error) {

  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function DELETE(req: NextRequest) {
  const { testHistoryId } = await req.json();

  // Validate that all required fields are provided
  if (!testHistoryId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  let client;

  try {
    client = await pool.connect();
    const query = `
      DELETE FROM test_history
      WHERE id = $1
      RETURNING *;
    `;

    const values = [testHistoryId];

    const result = await client.query(query, values);

    return NextResponse.json({ status: 204 });
  } catch (error) {

  } finally {
    if (client) {
      client.release();
    }
  }
}
