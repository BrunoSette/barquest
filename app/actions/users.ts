"use server";

const BASE_URL = process.env.BASE_URL;

export async function getUsers() {
  try {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getTeams() {
  try {
    const response = await fetch(`${BASE_URL}/api/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

export async function getContacts() {
  try {
    const response = await fetch(
      `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Resend API Error:", {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      });
      throw new Error(`Resend API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Resend API Response:", data);
    
    return data.data ?? [];
  } catch (error: any) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}
