const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database with all 8 Products
const products = [
  { id: 1, name: "Wireless Headphones", price: 2999, image: "images/headphones.jpg", description: "High-quality wireless headphones with noise cancellation." },
  { id: 2, name: "Smart Watch", price: 1499, image: "images/smartwatch.jpg", description: "Fitness tracker with heart rate monitor." },
  { id: 3, name: "Gaming Mouse", price: 1499, image: "images/mouse.jpg", description: "Ergonomic gaming mouse with customizable RGB." },
  { id: 4, name: "Mechanical Keyboard", price: 8999, image: "images/keyboard.jpg", description: "RGB mechanical keyboard with tactile switches." },
  { id: 5, name: "4K Gaming Monitor", price: 11999, image: "images/monitor.jpg", description: "Ultra-wide 4K gaming monitor with a smooth 144Hz refresh rate." },
  { id: 6, name: "Bluetooth Speaker", price: 6500, image: "images/speaker.jpg", description: "Portable Bluetooth speaker featuring deep bass and long battery life." },
  { id: 7, name: "1080p HD Webcam", price: 3500, image: "images/webcam.jpg", description: "Full HD webcam with built-in dual microphone for crisp video calls." },
  { id: 8, name: "Fast Power Bank", price: 2799, image: "images/powerbank.jpg", description: "20,000mAh fast-charging power bank with dual USB outputs." }
];

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/orders', (req, res) => {
  const { cartItems, userId } = req.body;
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  res.status(201).json({ message: "Order placed successfully!", orderId });
});

// Serve Frontend View
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});