const express = require("express");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/about.html"));
});

app.get("/map", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/map.html"));
});

app.get("/report", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/report.html"));
});

app.get("/api/external-crime", async (req, res) => {
  try {
    const apiUrl =
      "https://data.princegeorgescountymd.gov/resource/xjru-idbe.json?$limit=100";

    const response = await fetch(apiUrl);

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Could not load external crime data",
      error: error.message
    });
  }
});

app.get("/api/reports", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json(error);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Could not load reports",
      error: error.message
    });
  }
});

app.post("/api/reports", async (req, res) => {
  try {
    const { location, description } = req.body;

    if (!location || !description) {
      return res.status(400).json({
        message: "Location and description are required"
      });
    }

    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          location,
          description
        }
      ])
      .select();

    if (error) {
      return res.status(500).json(error);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Could not submit report",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SafeRoute server running on port ${PORT}`);
});