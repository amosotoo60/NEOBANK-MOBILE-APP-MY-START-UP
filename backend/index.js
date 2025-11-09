/**
 * Mock Express Server for SuperApp (Frontend PIN login + Wallet + Listings)
 * Run: npm install express body-parser cors uuid && node index.js
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// ===== In-Memory Mock Database =====
const db = {
  users: [],
  wallets: {},
  listings: [],
  chats: {},
};

// ===== Root Test Route =====
app.get('/', (req, res) => {
  res.send('✅ SuperApp Mock Server is running on port ' + PORT);
});

// ===== AUTH ROUTES =====

// Signup
app.post('/api/v1/auth/signup', (req, res) => {
  const { email, password } = req.body;
  const id = uuidv4();

  const user = {
    id,
    email,
    name: '',
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  db.wallets[id] = { userId: id, balance: 100.0, currency: 'USD' }; // default demo wallet

  return res.json({
    user,
    accessToken: 'demo-token-' + id,
    refreshToken: 'refresh-' + id,
  });
});

// Login by Email
app.post('/api/v1/auth/login', (req, res) => {
  const { email } = req.body;
  const user = db.users.find((u) => u.email === email);

  if (!user) return res.status(404).json({ error: 'User not found' });

  return res.json({
    user,
    accessToken: 'demo-token-' + user.id,
  });
});

// ===== WALLET ROUTES =====

// Get balance
app.get('/api/v1/wallets/:userId/balance', (req, res) => {
  const w = db.wallets[req.params.userId];
  if (!w) return res.status(404).json({ error: 'Wallet not found' });
  return res.json({ balance: w.balance, currency: w.currency });
});

// Send money
app.post('/api/v1/wallets/:userId/send', (req, res) => {
  const fromId = req.params.userId;
  const { to, amount } = req.body;

  if (!db.wallets[fromId]) return res.status(404).json({ error: 'Sender wallet not found' });

  let toUser = db.users.find((u) => u.id === to || u.email === to);
  if (!toUser) {
    const id = uuidv4();
    toUser = { id, email: to.includes('@') ? to : '', name: '', createdAt: new Date().toISOString() };
    db.users.push(toUser);
    db.wallets[id] = { userId: id, balance: 0.0, currency: 'USD' };
  }

  const amt = Number(amount) || 0;
  if (db.wallets[fromId].balance < amt) return res.status(400).json({ error: 'Insufficient funds' });

  db.wallets[fromId].balance -= amt;
  db.wallets[toUser.id].balance += amt;

  const tx = {
    id: uuidv4(),
    from: fromId,
    to: toUser.id,
    amount: amt,
    createdAt: new Date().toISOString(),
  };

  return res.json({ tx });
});

// ===== LISTINGS =====
app.get('/api/v1/listings', (req, res) => res.json({ listings: db.listings }));

app.post('/api/v1/listings', (req, res) => {
  const { title, description, price } = req.body;
  const id = uuidv4();
  const listing = {
    id,
    title,
    description,
    price,
    images: [],
    createdAt: new Date().toISOString(),
  };
  db.listings.push(listing);
  res.status(201).json({ listing });
});

// ===== CHATS =====
app.post('/api/v1/chats', (req, res) => {
  const { participants } = req.body;
  const id = uuidv4();
  db.chats[id] = { id, participants, messages: [] };
  res.status(201).json({ chat: db.chats[id] });
});

app.get('/api/v1/chats/:chatId/messages', (req, res) => {
  const chat = db.chats[req.params.chatId];
  if (!chat) return res.status(404).json({ error: 'Chat not found' });
  res.json({ messages: chat.messages });
});

app.post('/api/v1/chats/:chatId/messages', (req, res) => {
  const chat = db.chats[req.params.chatId];
  if (!chat) return res.status(404).json({ error: 'Chat not found' });
  const { senderId, body } = req.body;
  const msg = { id: uuidv4(), senderId, body, createdAt: new Date().toISOString() };
  chat.messages.push(msg);
  res.status(201).json({ message: msg });
});

// ===== PIN LOGIN (for frontend mock) =====
const users = [
  {
    id: 1,
    name: 'Alice Johnson',
    pin: '123456',
    balance: 1200,
    transactions: [
      { desc: 'Coffee purchase', amount: -5 },
      { desc: 'Salary deposit', amount: 2000 },
    ],
  },
  {
    id: 2,
    name: 'Bob Smith',
    pin: '654321',
    balance: 800,
    transactions: [
      { desc: 'Bookstore', amount: -20 },
      { desc: 'Transfer received', amount: 100 },
    ],
  },
];

// ✅ Login endpoint using PIN (for your index.html)
app.post('/login', (req, res) => {
  const { pin } = req.body;
  console.log('Login attempt with PIN:', pin);

  if (!pin || pin.length !== 6) {
    return res.status(400).json({ success: false, message: 'PIN must be 6 digits' });
  }

  const user = users.find((u) => u.pin === pin);
  if (user) {
    return res.json({
      success: true,
      userId: user.id,
      name: user.name,
      balance: user.balance,
      transactions: user.transactions,
    });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid 6-digit PIN' });
  }
});

// Fetch balance & transactions
app.get('/user/:id', (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  if (user) {
    res.json({ balance: user.balance, transactions: user.transactions });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => console.log(`🚀 Mock server running on port ${PORT}`));
