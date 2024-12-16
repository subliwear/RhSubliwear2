const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeaveStatus,
  addComment,
  deleteLeave
} = require('../controllers/leaveController');

// Routes protégées par authentification
router.use(protect);

// Routes CRUD
router.route('/')
  .get(getLeaves)
  .post(createLeave);

router.route('/:id')
  .get(getLeaveById)
  .delete(deleteLeave);

// Routes spécifiques
router.patch('/:id/status', updateLeaveStatus);
router.post('/:id/comments', addComment);

module.exports = router; 