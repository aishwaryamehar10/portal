import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  let token: string | undefined; // Initialize token variable

  try {
    // Checking if the user already exists
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
            query CheckExistingUser($username: String!) {
              users(where: { username: { _eq: $username } }) {
                username
              }
            }
          `,
          variables: {
            username,
          },
        }),
      }
    );

    const existingUserData = await existingUserResponse.json();

    // Check if there is an existing user
    const existingUser = existingUserData.data?.users.length > 0;

    // If the username already exists, return an error
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Username already exists. Please choose a different username.",
      });
    }

    // If the username is not there, then create a user
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserResponse = await fetch(
      "https://portal-next.hasura.app/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret":
            "5GhaMPMjP6RTdbYVApWXoRVp0FQWjrtDtVQ6i0UV8H5g6x3EpJuW87qbxXntMWiz",
        },
        body: JSON.stringify({
          query: `
            mutation CreateUser($username: String!, $password: String!) {
              insert_users_one(object: {  username: $username, password: $password }) {
                id,
                username,
                password
              }
            }
          `,
          variables: {
            username,
            password: hashedPassword,
          },
        }),
      }
    );

    const createdUserData = await createUserResponse.json();

    if (createdUserData.errors) {
      console.error("Error during user creation:", createdUserData.errors);
      return NextResponse.json({
        success: false,
        message: "Failed to create user. Please try again.",
      });
    }
    if (createdUserData.data && createdUserData.data.insert_users_one) {
      console.error("Error during user creation:", createdUserData.errors);
      token = jwt.sign(
        { username },
        "5GhaMPMjP6RTdbYVApWXoRVp0FQWjrtDtVQ6i0UV8H5g6x3EpJuW87qbxXntMWiz",
        { expiresIn: "1h" }
      );

      // Check if token is defined before returning
      if (token) {
        return NextResponse.json({ success: true, token });
      }
    }

    // Log the unexpected error
    console.error("Unexpected error during signup:", createdUserData);
    return NextResponse.json({
      success: false,
      message: "Failed to create user or generate token. Please try again.",
    });
  } catch (error: any) {
    // Log the error
    console.error("Signup error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: error.message, // Include the error message in the response
    });
  }
}
