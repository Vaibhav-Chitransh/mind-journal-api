import express from 'express';
import { createEntry, deleteEntry, getAllEntries, getEntryById, updateEntry } from '../controllers/journalController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllEntries);
router.get('/:id', protect, getEntryById);
router.post('/', protect, createEntry);
router.put('/:id', protect, updateEntry);
router.delete('/:id', protect, deleteEntry);

export default router;