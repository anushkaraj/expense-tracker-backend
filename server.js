const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Read the data from the JSON file
let jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
console.log(jsonData)
app.post('/processNumbers', (req, res) => {
  const { numbers } = req.body;

  // Process the numbers and change corresponding values to "ritik" in the JSON file
  numbers.forEach((num) => {
    // Determine the dictionary key and value key based on the input number
    const dictionaryKey = `dictionary${num % 2 + 1}`;
    const valueKey = `value${num % 3 + 1}`;

    // Change the corresponding value to "ritik" in the JSON file
    jsonData[dictionaryKey][valueKey] = "ritik";
  });

  // Write the updated JSON data back to the file
  fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2), 'utf-8');

  res.json(jsonData);
//   return jsonData
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
