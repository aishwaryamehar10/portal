import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const existingUserResponse = await fetch(
      "https://portal-next.hasura.app/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "x-hasura-admin-secret":
            "5GhaMPMjP6RTdbYVApWXoRVp0FQWjrtDtVQ6i0UV8H5g6x3EpJuW87qbxXntMWiz",
        },
        body: JSON.stringify({
          query: `
            query GetUser($username: String!) {
              users(where: { username: { _eq: $username } }) {
                username
                password
              }
            }
          `,
          variables: {
            username,
          },
        }),
      }
    );

    const userData = await existingUserResponse.json();
    const user = userData.data.users[0];

    // If user does not exist, return an error
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign(
        { username: user.username },
        "5GhaMPMjP6RTdbYVApWXoRVp0FQWjrtDtVQ6i0UV8H5g6x3EpJuW87qbxXntMWiz",
        { expiresIn: "1h" }
      );

      return NextResponse.json({ success: true, token });
    } else {
      // Return error if password does not match
      return NextResponse.json({
        success: false,
        message: "Invalid username or password",
      });
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
