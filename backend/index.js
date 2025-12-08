import express from 'express'
import dotenv from 'dotenv'
import baseRoutes from './routes/baseRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import connectDB from './config/db.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());  // Middleware to parse JSON body

app.use('/', baseRoutes);
app.use('/journal', journalRoutes)

app.use((req, res) => {
    res.status(404).json({error: "Route not found"});
})

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Express server running at http://localhost:${PORT}`);
    })
}

startServer();