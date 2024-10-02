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
    let { subjectIds, maxQuestions, questionMode, userId } =
      JSON.parse(rawBody);
    console.log("Parsed subjectIds:", subjectIds);
    console.log("Parsed maxQuestions:", maxQuestions);
    console.log("Parsed questionMode:", questionMode);
    console.log("Parsed userId:", userId);

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
    if (typeof userId !== "number" || userId <= 0) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 401 }
      );
    }
    if (!["unused", "incorrect", "all"].includes(questionMode)) {
      return NextResponse.json(
        { error: "Invalid questionMode format" },
        { status: 400 }
      );
    }

    client = await pool.connect();

    let query = `
      SELECT q.id, q.subject_id AS "subjectId", q.question_text AS "questionText", q.answer1, q.answer2, q.answer3, q.answer4, q.correct_answer AS "correctAnswer", q.comments
      FROM questions q
    `;
    let values;

    if (questionMode === "unused") {
      query += `
        LEFT JOIN user_answers ua ON q.id = ua.question_id AND ua.user_id = $3
        WHERE q.subject_id = ANY($1::int[]) AND ua.question_id IS NULL
      `;
      values = [subjectIds, maxQuestions, userId];
    } else if (questionMode === "incorrect") {
      query += `
        JOIN user_answers ua ON q.id = ua.question_id AND ua.user_id = $3
        WHERE q.subject_id = ANY($1::int[]) AND ua.is_correct = false
      `;
      values = [subjectIds, maxQuestions, userId];
    } else if (questionMode === "all") {
      query += `
        WHERE q.subject_id = ANY($1::int[])
      `;
      values = [subjectIds, maxQuestions];
    }

    query += `
      ORDER BY RANDOM()
      LIMIT $2;
    `;

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
