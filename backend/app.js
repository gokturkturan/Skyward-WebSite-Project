import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRouters from "./routes/user.js";
import adRouters from "./routes/ad.js";
dotenv.config();
connectDB();

const port = process.env.PORT;

const app = express();

app.use(express.json({ limit: "500kb" }));
app.use(morgan("dev"));
app.use(cors());

app.use("/api/users", userRouters);
app.use("/api/ads", adRouters);

app.listen(port, () => console.log(`Server running on port ${port}`));
