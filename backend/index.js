import http from 'http';
import url from 'url';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;

// Fake database
let entries = [
    {
        id: 1,
        title: "First entry",
        content: "Hello Journal",
        createdAt: new Date().toISOString()
    }
];

const sendJSON = (res, statusCode, data) => {
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
}

let nextId = 2;

const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => body += chunk.toString());

        req.on("end", () => {
            if(!body) return resolve({});

            try {
                const parsed = JSON.parse(body);
                resolve(parsed);
            } catch (error) {
                reject(error);
            }
        })

        req.on("error", err => reject(err));
    })
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);   // true -> also parse query params
    const path = parsedUrl.pathname;
    const method = req.method;

    console.log(method, path);
    

    // ROUTES


    // GET /
    if(path === '/' && method === 'GET') return sendJSON(res, 200, {message: "Mind Journal API root"});

    // GET /health
    if(path === '/health' && method === 'GET') return sendJSON(res, 200, {staus: 'ok', uptime: process.uptime()});

    // GET /journal
    if(path === '/journal' && method === 'GET') return sendJSON(res, 200, {entries});

    // POST /journal
    if(path === '/journal' && method === 'POST') {
        try {
            const body = await getRequestBody(req);
            const {title, content} = body;

            if(!title || !content) return sendJSON(res, 400, {error: "title and content are required"});

            const newEntry = {
                id: nextId++,
                title,
                content,
                createdAt: new Date().toISOString()
            }

            entries.push(newEntry);
            return sendJSON(res, 201, {entry: newEntry});
        } catch (error) {
            console.log("Error parsing body: ", error);
            return sendJSON(res, 400, {error: "Invalid JSON body"});
        }
    } 

    // GET /journal/:id
    if(method === 'GET' && path.startsWith('/journal/')) {
        const parts = path.split("/");

        const id = Number(parts[2]);

        if(isNaN(id)) return sendJSON(res, 400, {error: "Invalid ID"});

        const entry = entries.find(e => e.id === id);

        if(!entry) return sendJSON(res, 404, {error: 'Entry not found'});

        return sendJSON(res, 200, {entry});
    }

    return sendJSON(res, 404, {error: "Route Not Found"});
})

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})