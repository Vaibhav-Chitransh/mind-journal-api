import mongoose from 'mongoose';
import Entry from '../models/entryModel.js';

export const getAllEntries = async (req, res) => {
    try {
        const entries = await Entry.find().sort({createdAt: -1});
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

        res.status(200).json({entry});
    } catch (error) {
        console.error(`Error fetching entry: ${err}`);
        res.status(500).json({error: 'Server error while fetching entry'});
    }
}

export const createEntry = async (req, res) => {
    try {
        const {title, content} = req.body;

        if(!title || !content) return res.status(400).json({error: "title and content are required"});

        const entry = await Entry.create({title, content});
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

        const {title, content} = req.body;

        if(!title && !content) return res.status(400).json({error: 'Nothing to update'});

        const entry = await Entry.findById(id);

        if(!entry) return res.status(400).json({error: "Entry not found"});

        if(title) entry.title = title;
        if(content) entry.content = content;

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

        const deleted = await Entry.findByIdAndDelete(id);

        if(!deleted) return res.status(400).json({error: "Entry not found"});
        
        res.status(200).json({deleted});
   } catch (error) {
        console.error(`Error deleting entry: ${error}`);
        res.status(500).json({entry});
   }
}