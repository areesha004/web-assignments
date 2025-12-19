import express from 'express';
import { connectDB } from './lib/MongoConnection.js';
import dotenv from "dotenv";
import cors from 'cors';
import router from './Routes/ProductsRouter.js';

dotenv.config();
const app = express();

app.use(cors()); 

app.use(express.json());

connectDB();

app.use("/api/products", router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
