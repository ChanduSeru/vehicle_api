const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./db'); // Importing the auth model from db.js

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Default route
app.get('/', (req, res) => res.send('Hello World!'));

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await auth.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found", status: 404 });
    }

    const isMatch = await bcrypt.compare(pass, user.pass);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials", status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });

    res.json({ msg: "Login successful", status: 200, token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ msg: "Error logging in", status: 500 });
  }
});

// Register endpoint
app.post("/register", async (req, res) => {
  const { email, pass } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Create new user
    const newUser = new auth({ email, pass: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully", status: 201 });
  } catch (error) {
    console.error("Error registering new user:", error);
    res.status(500).json({ msg: "Error registering new user", status: 500 });
  }
});

// Start server
app.listen(port, () => console.log(`App listening on port ${port}!`));
