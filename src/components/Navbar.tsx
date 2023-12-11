import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ backgroundColor: "white" }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, color: "black" }}>
          PORTAL
        </Typography>
        <Button color="primary">
          <Link href="/login">Login</Link>
        </Button>
        <Button color="primary">
          <Link href="/signup">SignUp</Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
