const express = require('express');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/map.html'));
});

app.get('/api/external-crime', async (req, res) => {
  try {
    const response = await fetch(
      'https://data.princegeorgescountymd.gov/resource/xjru-idbe.json?$limit=50'
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports', async (req, res) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*');

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

app.post('/api/reports', async (req, res) => {
  const { location, description } = req.body;

  const { data, error } = await supabase
    .from('reports')
    .insert([
      {
        location,
        description
      }
    ]);

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});