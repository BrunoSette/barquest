import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST(req: NextRequest) {
  let client;
  try {
    // Log the raw request body
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    // Parse the JSON body
    let { subjectIds, maxQuestions } = JSON.parse(rawBody);
    console.log("Parsed subjectIds:", subjectIds);
    console.log("Parsed maxQuestions:", maxQuestions);

    // Validate the parsed values
    if (
      !Array.isArray(subjectIds) ||
      !subjectIds.every((id) => Number.isInteger(Number(id)))
    ) {
      return NextResponse.json(
        { error: "Invalid subjectIds format" },
        { status: 403 }
      );
    }
    if (typeof maxQuestions !== "number" || maxQuestions <= 0) {
      return NextResponse.json(
        { error: "Invalid maxQuestions format" },
        { status: 402 }
      );
    }

    client = await pool.connect();
    const query = `
      SELECT id, subject_id AS "subjectId", question_text AS "questionText", answer1, answer2, answer3, answer4, correct_answer AS "correctAnswer", comments
      FROM questions
      WHERE subject_id = ANY($1::int[])
      LIMIT $2;
    `;

    const values = [subjectIds, maxQuestions];

    console.log("Executing query with values:", values); // Log the values

    const result = await client.query(query, values);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
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
