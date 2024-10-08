import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  console.log("Fetching total answers and test history for user:", user_id);

  if (!user_id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  let client;
  try {
    client = await pool.connect();
    console.log("Database connection established");

    // Query for user answers summary
    const answersQuery = `
      SELECT 
        s.name AS subject,
        COUNT(ua.id) AS total_answers,
        COUNT(ua.id) FILTER (WHERE ua.is_correct = true) AS correct_answers
      FROM user_answers ua
      JOIN questions q ON ua.question_id = q.id
      JOIN subjects s ON q.subject_id = s.id
      WHERE ua.user_id = $1
      GROUP BY s.name;
    `;
    const answersValues = [user_id];
    const answersResult = await client.query(answersQuery, answersValues);
    console.log("Answers query executed successfully");

    // Query for test history
    const historyQuery = `
      SELECT 
        id,
        score,
        questions,
        timed,
        tutor,
        questionmode,
        new_questions,
        date
      FROM test_history
      WHERE user_id = $1;
    `;
    const historyValues = [user_id];
    const historyResult = await client.query(historyQuery, historyValues);
    console.log("History query executed successfully");

    const totalAnswers = answersResult.rows.reduce(
      (acc, row) => acc + parseInt(row.total_answers),
      0
    );
    const correctAnswers = answersResult.rows.reduce(
      (acc, row) => acc + parseInt(row.correct_answers),
      0
    );

    const answersPerSubject = answersResult.rows.map((row) => ({
      subject: row.subject,
      total_answers: row.total_answers,
      correct_answers: row.correct_answers,
    }));

    const testHistory = historyResult.rows.map((row) => ({
      id: row.id,
      score: row.score,
      questions: row.questions,
      timed: row.timed,
      tutor: row.tutor,
      questionmode: row.questionmode,
      new_questions: row.new_questions,
      date: row.date,
    }));

    return NextResponse.json({
      total_answers: totalAnswers,
      correct_answers: correctAnswers,
      answers_per_subject: answersPerSubject,
      test_history: testHistory,
    });
  } catch (error) {
    console.error("Error fetching answers and test history:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
      console.log("Database connection released");
    }
  }
}
