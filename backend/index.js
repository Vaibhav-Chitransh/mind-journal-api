import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({message: "Mind Journal API is running"}));
})

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})