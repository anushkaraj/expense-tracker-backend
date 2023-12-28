const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Read the data from the JSON file
const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

app.post('/processNumbers', (req, res) => {
  const { numbers } = req.body;

  // Process the numbers and get corresponding values from the JSON file
  const resultValues = numbers.map((num) => {
    // Determine the dictionary key and value key based on the input number
    const dictionaryKey = `dictionary${num % 2 + 1}`;
    const valueKey = `value${num % 3 + 1}`;

    // Retrieve the corresponding value from the JSON file
    return jsonData[dictionaryKey][valueKey];
  });

  res.json(resultValues);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
