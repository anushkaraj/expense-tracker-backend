const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/processNumbers', (req, res) => {
  const { numbers } = req.body;

  // Process the numbers (remove odd numbers)
  const resultNumbers = numbers.filter((num) => num % 2 === 0);

  res.json(resultNumbers);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
