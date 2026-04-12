const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Movie Database API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
