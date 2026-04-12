const express = require('express');
const { protect } = require('../middlewares/auth');
const { getList, addToList, removeFromList, checkListStatus } = require('../controllers/listController');

const router = express.Router();

// "/status/:movieId" must come BEFORE "/:listType" to avoid "status" being parsed as listType
router.get('/status/:movieId', protect, checkListStatus);
router.get('/:listType', protect, getList);
router.post('/', protect, addToList);
router.delete('/:listType/:movieId', protect, removeFromList);

module.exports = router;
