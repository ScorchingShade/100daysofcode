const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

// Data model
const users = [];
const items = [];
const carts = [];
const orders = [];
const cartItems = [];

// Middleware to parse request bodies
app.use(bodyParser.json());

// Helper function to generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user.id }, "secret-key");
}

// Helper function to authenticate requests
function authenticate(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }
  try {
    const decoded = jwt.verify(token, "secret-key");
    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Something went wrong, please log in with correct credentials again" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(409).json({ message: "Error while authenticating" });
  }
}

// API endpoints

// Create a new user
app.post("/user/create", (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const user = {
    id: users.length + 1,
    name,
    username,
    password,
    token: "",
    cart_id: null,
    created_at: new Date(),
  };

   // check if user already exists
   const existingUser = users.find(u => u.username === username);
   if (existingUser) {
     return res.status(409).send('User already exists');
   }

  users.push(user);
  return res.status(201).json(user);
});

// Login for existing user
app.post("/user/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // Generate token and save to user
  const token = generateToken(user);
  user.token = token;
  return res.json({ token });
});

// Create a new item
app.post("/item/create", authenticate, (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const item = {
    id: items.length + 1,
    name,
    created_at: new Date(),
  };
  items.push(item);
  return res.status(201).json(item);
});

// Add items to cart
app.post("/cart/add", authenticate, (req, res) => {
  const { item_id } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const user = Object.values(users).find((u) => u.token === token);

  if (user) {
    if (user.cart_id === null) {
      // Create a new cart for the user
      const cart_id = Object.keys(carts).length;
      carts[cart_id] = {
        id: cart_id+1,
        user_id: user.id,
        is_purchased: false,
        created_at: new Date(),
      };
      user.cart_id = cart_id+1;
    }
     // Get user's cart
  const cart = carts.find(c => c.user_id === user.id && !c.is_purchased);

  if (!cart) {
    res.status(404).send('No active cart found');
    return;
  }


  //Check if item exists to add in cart 
  const itemToAdd = items.find((i)=>i.id===item_id)

  if(!itemToAdd){
    res.status(404).json({ message: "Can't add item, item not found" });
    return;
  }

    // Add item to cart
    const cartItem = {
      cart_id: user.cart_id,
      item_id,
    };
    cartItems.push(cartItem);
    res.json({ message: "Item added to cart" });
  } else {
    res.status(401).send("Unauthorized");
  }
});

// Delete item from cart
app.delete("/cart/delete", authenticate, (req, res) => {
  const { item_id } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const user = Object.values(users).find((u) => u.token === token);

  if (user) {
    const cart = carts.find(c => c.user_id === user.id && !c.is_purchased);

    if (!cart) {
      res.status(404).send('No active cart found');
      return;
    }

    // Check if item exists in cart
    const itemIndex = cartItems.findIndex(ci => ci.cart_id === cart.id && ci.item_id === item_id);
    
    if (itemIndex === -1) {
      res.status(404).json({ message: "Can't delete item, item not found in cart" });
      return;
    }

    // Remove item from cart
    cartItems.splice(itemIndex, 1);
    res.json({ message: "Item deleted from cart" });
  } else {
    res.status(401).send("Unauthorized");
  }
});

// Convert cart to order
app.post("/cart/:cartId/complete", (req, res) => {
  const cart_id = parseInt(req.params.cartId);
  const token = req.headers.authorization.split(" ")[1];
  const user = Object.values(users).find((u) => u.token === token);
  
  if (user && user.cart_id === cart_id) {
    // Mark cart as purchased
    const cart = carts[cart_id-1];
    cart.is_purchased = true;
    // Create new order
    const order_id = Object.keys(orders).length;
    orders[order_id] = {
      id: order_id+1,
      cart_id: cart_id,
      user_id: user.id,
      created_at: new Date(),
    };

    // creates a new empty cart for user to purchase again
    const newCart_id = Object.keys(carts).length;
    carts[newCart_id] = {
      id: newCart_id+1,
      user_id: user.id,
      is_purchased: false,
      created_at: new Date(),
    };
    user.cart_id = newCart_id+1;


    res.status(200).json({ message: "Cart converted to order successfully" });
  } else {
    res.status(401).json({ message: "Unauthorized access" });
  }
});

// List all users
app.get("/user/list", authenticate, (req, res) => {
res.status(200).send(users);
});

// List all items
app.get("/item/list", (req, res) => {
  res.status(200).send(items);
});

// List all cart items
app.get("/cart/list", authenticate, (req, res) => {
  const user = req.user;
  const cart = carts.find((c)=>c.id===user.cart_id);
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const userCartItems = cartItems.filter(ci => ci.cart_id === cart.id);
  const itemsInCart = userCartItems.map(ci => items.find(item => item.id === ci.item_id));

  res.json({ cart, itemsInCart });
  res.status(200)
});

//list all orders 
app.get("/orders/list",authenticate, (req,res)=>{
  const user = req.user;
  const order = orders.filter((o)=>o.user_id===user.id);
  if (!order) {
    return res.status(404).json({ message: "Orders not found" });
  }

  res.status(200).send(order)
})

  // start the server
  const port = 3000;
// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

