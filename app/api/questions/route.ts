import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

// Initialize the connection pool with the PostgreSQL connection string
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// POST handler to create a new question
export async function POST(req: NextRequest) {
  const {
    subjectId,
    questionText,
    answer1,
    answer2,
    answer3,
    answer4,
    correctAnswer,
    comments,
  } = await req.json();

  try {
    const client = await pool.connect();

    // SQL query to insert a new question
    const query = `
      INSERT INTO questions (subject_id, question_text, answer1, answer2, answer3, answer4, correct_answer, comments, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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
      comments,
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

// PUT handler to update an existing question
export async function PUT(req: NextRequest) {
  const {
    id,
    subjectId,
    questionText,
    answer1,
    answer2,
    answer3,
    answer4,
    comments,
    correctAnswer,
    is_approved = false, // Default to false if is_approved is undefined
  } = await req.json();

  try {
    const client = await pool.connect();

    // Log the payload to verify incoming data
    console.log("Payload received for update:", {
      id,
      subjectId,
      questionText,
      answer1,
      answer2,
      answer3,
      answer4,
      comments,
      correctAnswer,
      is_approved,
    });

    // SQL query to update the question
    const query = `
      UPDATE questions
      SET subject_id = $1, question_text = $2, answer1 = $3, answer2 = $4, answer3 = $5, answer4 = $6, comments = $7, correct_answer = $8, is_approved = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10;
    `;

    const values = [
      subjectId,
      questionText,
      answer1,
      answer2,
      answer3,
      answer4,
      comments,
      correctAnswer,
      is_approved,
      id,
    ];

    const updateResult = await client.query(query, values);

    // Log the result to ensure the update was successful
    console.log("Update result:", updateResult);

    client.release();

    return NextResponse.json(
      { message: `Question updated successfully: ${questionText}` },
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

// DELETE handler to delete a question
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  try {
    const client = await pool.connect();

    // SQL query to delete the question
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

// GET handler to retrieve all questions
export async function GET(req: NextRequest) {
  try {
    const client = await pool.connect();

    // SQL query to fetch questions, including is_approved
    const query = `
      SELECT id, subject_id AS "subjectId", question_text AS "questionText", answer1, answer2, answer3, answer4, correct_answer AS "correctAnswer", comments, is_approved
      FROM questions;
    `;

    const result = await client.query(query);

    // Log the fetched questions for debugging
    console.log("Fetched questions:", result.rows);

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
