const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Redirect from '/' to '/home'
app.get('/', (req, res) => {
  res.redirect('/home'); // relative redirect
});

// Example target route
app.get('/home', (req, res) => {
  res.send('Welcome to the aHome Page!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
