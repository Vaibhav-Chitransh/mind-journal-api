import mongoose from 'mongoose';
import Entry from '../models/entryModel.js';

export const getAllEntries = async (req, res) => {
    try {
        const entries = await Entry.find({user: req.user.id}).sort({createdAt: -1});
        res.status(200).json({entries});
    } catch (error) {
        console.error(`Error fetching entries: ${error}`);
        res.status(500).json({error: 'Server error while fetching entries'});
    }
}

export const getEntryById = async (req, res) => {
    try {
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: "Invalid ID"});

        const entry = await Entry.findById(id);

        if(!entry) return res.status(400).json({error: "Entry not found"});

        const isOwner = entry.user.toString() === req.user.id;
        const isPublic = entry.visibility === 'public';

        if(!isOwner && !isPublic) return res.status(403).json({error: 'Not authorized to access this entry'});

        res.status(200).json({entry});
    } catch (error) {
        console.error(`Error fetching entry: ${err}`);
        res.status(500).json({error: 'Server error while fetching entry'});
    }
}

export const createEntry = async (req, res) => {
    try {
        const {title, content, visibility} = req.body;

        if(!title || !content) return res.status(400).json({error: "title and content are required"});

        const entry = await Entry.create({
            user: req.user.id,
            title,
            content,
            visibility: visibility === 'public' ? 'public' : 'private'
        });
        res.status(201).json({entry});
    } catch (error) {
        console.error(`Error creating entry: ${error}`);
        res.status(500).json({error: 'Server error while creating entry'});
    }
}

export const updateEntry = async (req, res) => {
    try {
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: "Invalid ID"});

        const entry = await Entry.findById(id);
        if(!entry) return res.status(400).json({error: "Entry not found"});

        if(entry.user.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized to edit this entry' });

        const { title, content, visibility } = req.body;

        if(title) entry.title = title;
        if(content) entry.content = content;
        if(visibility) entry.visibility = visibility === 'public' ? 'public' : 'private';

        await entry.save();

        return res.status(200).json({entry});
    } catch (error) {
        console.error(`Error updating entry: ${error}`);
        res.status(500).json({error: 'Server error while updating entry'});
    }
}

export const deleteEntry = async (req, res) => {
   try {
        const {id} = req.params; 

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: "Invalid ID"});

        const entry = await Entry.findById(id);
        if(!entry) return res.status(400).json({error: "Entry not found"});

        if(entry.user.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized to delete this entry' });        

        await entry.deleteOne();
        
        res.status(200).json({message: 'Entry deleted successfully'});
   } catch (error) {
        console.error(`Error deleting entry: ${error}`);
        res.status(500).json({entry});
   }
}

// export const likeEntry = async (req, res) => {
//     try {
//         const {id} = req.params;

//         if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error: 'Invalid ID'});

//         const entry = await Entry.findById(id);

//         if(!entry) return res.status(404).json({error: 'Entry not found'});

//         const isOwner = entry.user.toString() === req.user.id;
//         const isPublic = entry.visibility === 'public';

//         if(!isOwner && !isPublic) return res.status(403).json({error: 'Not authorized to react to this entry'});

//         const userId = req.user.id;
//     } catch (err) {
//         console.error('Error liking entry: ', err);
//         res.status(500).json({error: 'Server error while liking entry'});
//     }
// }