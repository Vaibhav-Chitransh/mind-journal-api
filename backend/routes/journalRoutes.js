import express from 'express';
import { createEntry, deleteEntry, getAllEntries, getEntryById, updateEntry } from '../controllers/journalController.js';

const router = express.Router();

router.get('/', getAllEntries);
router.get('/:id', getEntryById);
router.post('/', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

export default router;