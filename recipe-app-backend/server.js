// Updated server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 5001;

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the Recipe App API!");
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Normalize email to lowercase
    const emailNormalized = email.toLowerCase();
    console.log("Attempting to create user with email:", emailNormalized);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: emailNormalized } });
    console.log("Existing user found:", existingUser);

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: emailNormalized,
        password: hashedPassword,
      },
    });

    console.log("User created successfully:", user);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Normalize email to lowercase
    const emailNormalized = email.toLowerCase();

    console.log("Attempting to log in user with email:", emailNormalized);

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email: emailNormalized } });
    console.log("User found during login:", user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all recipes
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany();
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new recipe (requires authentication)
app.post("/recipes", authenticateToken, async (req, res) => {
  const { title, description } = req.body;

  try {
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
      },
    });
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add or remove a favorite recipe (toggle, requires authentication)
app.post('/favorites/toggle', authenticateToken, async (req, res) => {
  const { recipeId } = req.body;
  const userId = req.user.userId;

  try {
    // Check if the recipe is already in the user's favorites
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: userId,
        recipeId: recipeId,
      },
    });

    if (existingFavorite) {
      // If the favorite exists, remove it
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      return res.json({ message: 'Favorite removed', favorite: false });
    } else {
      // If it does not exist, add it as a favorite
      const newFavorite = await prisma.favorite.create({
        data: {
          userId,
          recipeId,
        },
      });
      return res.status(201).json({ message: 'Favorite added', favorite: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch user's favorite recipes (requires authentication)
app.get('/favorites', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { recipe: true },
    });
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Unable to fetch favorites' });
  }
});

// Server listen
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
