import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import familyRoutes from "./routes/familyRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected"))
.catch(err=> console.log(err));

// routes
app.use("/api/family", familyRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));