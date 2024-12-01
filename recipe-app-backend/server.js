const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the Recipe App API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// In-memory database for recipes
let recipes = [
  { id: 1, title: "Pasta", description: "A delicious pasta dish." },
  { id: 2, title: "Salad", description: "A healthy salad." },
];

// Get all recipes
app.get("/recipes", (req, res) => {
  res.json(recipes);
});

// Get a single recipe by ID
app.get("/recipes/:id", (req, res) => {
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));
  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ message: "Recipe not found" });
  }
});

// Create a new recipe
app.post("/recipes", (req, res) => {
  const newRecipe = { id: recipes.length + 1, ...req.body };
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

// Update a recipe by ID
app.put("/recipes/:id", (req, res) => {
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));
  if (recipe) {
    Object.assign(recipe, req.body);
    res.json(recipe);
  } else {
    res.status(404).json({ message: "Recipe not found" });
  }
});

// Delete a recipe by ID
app.delete("/recipes/:id", (req, res) => {
  const index = recipes.findIndex((r) => r.id === parseInt(req.params.id));
  if (index !== -1) {
    recipes.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Recipe not found" });
  }
});
// In-memory database for users
let users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ];
  
  // Get all users
  app.get("/users", (req, res) => {
    res.json(users);
  });
  
  // Get a single user by ID
  app.get("/users/:id", (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
  
  // Create a new user
  app.post("/users", (req, res) => {
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
  });
  
  // Update a user by ID
  app.put("/users/:id", (req, res) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (user) {
      Object.assign(user, req.body);
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
  
  // Delete a user by ID
  app.delete("/users/:id", (req, res) => {
    const index = users.findIndex((u) => u.id === parseInt(req.params.id));
    if (index !== -1) {
      users.splice(index, 1);
      res.status(204).send();
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
  