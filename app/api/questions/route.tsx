import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST(req: NextRequest) {
  const {
    subjectId,
    questionText,
    answer1,
    answer2,
    answer3,
    answer4,
    correctAnswer,
  } = await req.json();

  try {
    const client = await pool.connect();

    const query = `
      INSERT INTO questions (subject_id, question_text, answer1, answer2, answer3, answer4, correct_answer, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id;
    `;

    const values = [
      subjectId,
      questionText,
      answer1,
      answer2,
      answer3,
      answer4,
      correctAnswer,
    ];

    const result = await client.query(query, values);

    client.release();

    return NextResponse.json(
      {
        message: "Question created successfully",
        id: result.rows[0].id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting question:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const {
    id,
    subjectId,
    questionText,
    answer1,
    answer2,
    answer3,
    answer4,
    correctAnswer,
  } = await req.json();

  try {
    const client = await pool.connect();

    const query = `
      UPDATE questions
      SET subject_id = $1, question_text = $2, answer1 = $3, answer2 = $4, answer3 = $5, answer4 = $6, correct_answer = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8;
    `;

    const values = [
      subjectId,
      questionText,
      answer1,
      answer2,
      answer3,
      answer4,
      correctAnswer,
      id,
    ];

    await client.query(query, values);

    client.release();

    return NextResponse.json(
      { message: "Question updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  try {
    const client = await pool.connect();

    const query = `
      DELETE FROM questions
      WHERE id = $1;
    `;

    const values = [id];

    await client.query(query, values);

    client.release();

    return NextResponse.json(
      { message: "Question deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const client = await pool.connect();

    const query = `
      SELECT * FROM questions;
    `;

    const result = await client.query(query);

    client.release();

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
