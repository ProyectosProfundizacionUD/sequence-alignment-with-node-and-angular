const path = require('path');
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/db');
require('dotenv').config();
//endpoints
const Sequence = require('./routes/sequence');
const Health = require('./routes/health');
const Alignment = require('./routes/alignments');
const dynamicAlignment = require('./routes/dynamicAlignment')
const dotPlot = require('./routes/dotplot')

const app = express();

app.use(express.json())
app.use(cors());
app.use('/api/sequence', Sequence);
app.use('/api', Health);
app.use('/api/align', Alignment);
app.use('/api/needleman-and-wunsch', dynamicAlignment);
app.use('/api/dotplot', dotPlot);

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(
  process.env.PORT,
  console.log(`Server is running now on port ${process.env.PORT}`)
);

dbConnection();