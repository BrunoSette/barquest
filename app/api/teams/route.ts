import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST(req: NextRequest) {
  let client;
  try {
    client = await pool.connect();
    const query = `
      SELECT 
        id, 
        name, 
        created_at, 
        updated_at, 
        stripe_customer_id, 
        stripe_subscription_id, 
        stripe_product_id, 
        plan_name, 
        subscription_status
      FROM teams;
    `;

    console.log("Executing query to fetch all teams");

    const result = await client.query(query);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
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
