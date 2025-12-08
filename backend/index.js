import express from 'express'
import dotenv from 'dotenv'
const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());  // Middleware to parse JSON body

let entries = [
  {
    id: 1,
    title: "First entry",
    content: "Hello journal",
    createdAt: new Date().toISOString(),
  },
]

let nextId = 2;


// ROOT: GET /
app.get("/", (req, res) => {
    res.status(200).json({message: "Mind Journal API root"});
})

// HEALTH: GET /health
app.get("/health", (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        entriesCount: entries.length,
    })
})

// GET /journal
app.get('/journal', (req, res) => {
    res.status(200).json({entries});
})

// GET /journal/:id
app.get('/journal/:id', (req, res) => {
    const id = Number(req.params.id);

    if(isNaN(id)) return res.status(400).json({error: "Invalid ID"});

    const entry = entries.find((e) => e.id === id);

    if(!entry) return res.status(404).json({error: "Entry not found"});

    res.status(200).json({entry});
})

// POST /journal
app.post('/journal', (req, res) => {
    const {title, content} = req.body;

    if(!title || !content) return res.status(400).json({error: "title and content are required"});

    const newEntry = {
        id: nextId++,
        title, 
        content,
        createdAt: new Date().toISOString()
    }

    entries.push(newEntry);
    res.status(201).json({entry: newEntry});
})

// PUT /journal/:id
app.put('/journal/:id', (req, res) => {
    const id = Number(req.params.id);

    if(isNaN(id)) return res.status(400).json({error: "Invalid ID"});

    const entryIndex = entries.findIndex((e) => e.id === id);

    if(entryIndex === -1) return res.status(404).json({error: "Entry not found"});

    const {title, content} = req.body;

    if(!title && !content) return res.status(400).json({error: "Nothing to update"});

    const existing = entries[entryIndex];

    const updated = {
        ...existing,
        title: title ?? existing.title,
        content: content ?? existing.content,
        updatedAt: new Date().toISOString()
    }

    entries[entryIndex] = updated;
    res.status(200).json({entry: updated});
})

// DELETE /journal/:id
app.delete('/journal/:id', (req, res) => {
    const id = Number(req.params.id);

    if(isNaN(id)) return res.status(400).json({error: "Invalid ID"});

    const entryIndex = entries.findIndex((e) => e.id === id);

    if (entryIndex === -1) return res.status(404).json({ error: "Entry not found" });

    const deleted = entries[entryIndex];
    entries.splice(entryIndex, 1);

    res.status(200).json({ deleted });
})

app.use((req, res) => {
    res.status(404).json({error: "Route not found"});
})

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}`);
})