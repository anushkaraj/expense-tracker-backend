const express = require('express');
const app = express();

const PORT = 5000;
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
