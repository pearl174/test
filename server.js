const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const friendRoutes = require("./routes/friendRoutes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // body parser
const allowedOrigins = [
  'https://badminton-stats-tracker-frontend-n7357or3j.vercel.app',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Allow Postman or server-to-server requests
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/match", require("./routes/matchRoutes"));
app.use("/api/friends", friendRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
