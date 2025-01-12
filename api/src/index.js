import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from './models/User.js';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import Place from './models/Place.js'; // Add the Place model import
import Booking from './models/Booking.js'; // Add the Booking model import
import imageDownloader from 'image-downloader';  // Assuming this is required for downloading images

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
}));

connectDB();

// Register route
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ name, email, password: hashedPassword });

  try {
    await newUser.save();
    const token = jwt.sign(
      { email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({ message: "Login successful", token, user });
});

// Profile route
app.get('/api/profile', (req, res) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) return res.status(403).json({ message: "Invalid or expired token" });

      try {
        const user = await UserModel.findById(userData.id);
        const { name, email, _id } = user;
        res.json({ name, email, _id });
      } catch (err) {
        res.status(500).json({ message: "Error fetching user data" });
      }
    });
  } else {
    res.json(null);
  }
});

// Logout route
app.post('/api/logout', (req, res) => {
  res.cookie('token', '', { maxAge: 0 }).json(true);
});

// Image upload by link route
app.post('/api/upload-by-link', async (req, res) => {
  const { link } = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  try {
    await imageDownloader.image({
      url: link,
      dest: '/tmp/' + newName,
    });
    res.json({ message: "Image downloaded successfully", imageUrl: '/tmp/' + newName });
  } catch (err) {
    res.status(500).json({ message: "Error downloading image", error: err });
  }
});

// Multer setup for uploading photos
const photosMiddleware = multer({ dest: '/tmp' });

app.post('/api/upload', photosMiddleware.array('photos', 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    uploadedFiles.push({ filePath: path, originalname, mimetype });
  }
  res.json(uploadedFiles);
});

// Create new place route
app.post('/api/places', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    title, address, addedPhotos, description, price,
    perks, extraInfo, checkIn, checkOut, maxGuests,
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });

    const placeDoc = await Place.create({
      owner: userData.id, price, title, address, photos: addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    });
    res.json(placeDoc);
  });
});

// Get user places route
app.get('/api/user-places', (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

// Get a single place route
app.get('/api/places/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

// Update place route
app.put('/api/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id, title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price,
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });

    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price,
      });
      await placeDoc.save();
      res.json('ok');
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  });
});

// Get all places route
app.get('/api/places', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Place.find());
});

// Create booking route
app.post('/api/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place, checkIn, checkOut, numberOfGuests, name, phone, price,
  } = req.body;
  
  try {
    const booking = await Booking.create({
      place, checkIn, checkOut, numberOfGuests, name, phone, price,
      user: userData.id,
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error creating booking", error: err });
  }
});

// Get bookings route
app.get('/api/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate('place'));
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
