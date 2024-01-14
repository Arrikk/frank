const express = require('express');
const fs = require('fs');
const path = require('path');
const init = require('./app');
const env = require("dotenv");
env.config({path: './.env'})

const app = express();
const port = process.env.PORT;

// Set the file path and name
const filePath = './book.xlsx';
const fileName = 'book.xlsx';

// Define a route for file download
app.get('/download', (req, res) => {
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set headers for download
    res.setHeader('Content-Description', 'File Transfer');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    res.setHeader('Expires', '0');
    res.setHeader('Cache-Control', 'must-revalidate');
    res.setHeader('Pragma', 'public');
    res.setHeader('Content-Length', fs.statSync(filePath).size);

    // Create a readable stream and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    // File not found, you can handle this situation as needed
    res.status(404).send('File not found.');
  }
});

app.get('/start', async (req, res) => {
  await init()
  res.send("OK Running")
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
