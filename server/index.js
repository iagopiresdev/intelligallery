import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB  from "./mongodb/connect.js";
import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

//API routes
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get("/", (req, res) => {
    res.send("API a todo vapor!");
});

//starting server
const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(5555, () => {
        console.log("Server is running on port 5555");
    });
    } catch (error) {
        console.log(error);
    }
};

startServer();
