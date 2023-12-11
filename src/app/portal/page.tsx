"use client";
import { Container, Grid, Box, TextField } from "@mui/material";
import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function Portal() {
  const data1 = [
    { label: "Group A", value: 400 },
    { label: "Group B", value: 300 },
    { label: "Group C", value: 300 },
    { label: "Group D", value: 200 },
    { label: "Group E", value: 278 },
    { label: "Group F", value: 189 },
  ];

  const data2 = [
    { label: "Group A", value: 2400 },
    { label: "Group B", value: 4567 },
    { label: "Group C", value: 1398 },
    { label: "Group D", value: 9800 },
    { label: "Group E", value: 3908 },
    { label: "Group F", value: 4800 },
  ];

  return (
    <Container>
      <Grid container spacing={2}>
        {[1, 2, 3].map((boxNumber) => (
          <Grid item xs={4} key={boxNumber}>
            <Box
              border={1}
              borderColor="primary.main"
              borderRadius={8}
              p={2}
              height={200}
              marginTop={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ backgroundColor: "skyblue" }}>
              <PieChart
                series={[
                  {
                    innerRadius: 0,
                    outerRadius: 80,
                    data: data1,
                  },
                  {
                    innerRadius: 100,
                    outerRadius: 80,
                    data: data2,
                  },
                ]}
                width={400}
                height={300}
                slotProps={{
                  legend: { hidden: true },
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            sx={{ marginTop: 2 }}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            sx={{ marginTop: 2 }}
          />
        </Grid>
        <Grid item xs={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <Box sx={{ marginTop: 2 }}>
                <DatePicker label="Basic date picker" />
              </Box>
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Container>
  );
}
