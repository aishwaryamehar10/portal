"use client";
import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TextField, Typography, Container, Button } from "@mui/material";

export default function Signup() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log("Login successful", data);
          alert("Login successful");
          router.push("/portal");
        } else {
          console.error("Login failed:", data.message);
        }
      } else {
        console.error("Login Failed");
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
      console.error("Login Failed:", error);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        margin: "auto",
        textAlign: "center",
        marginTop: "20vh",
        marginBottom: "20vh",
      }}>
      <div>
        <Typography variant="h5">Login</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            required
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Login
          </Button>
        </form>
      </div>
    </Container>
  );
}
