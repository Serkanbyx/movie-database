const express = require('express');
const { protect } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  addToListValidator,
  listTypeParamValidator,
  movieIdParamValidator,
} = require('../validators/listValidator');
const { getList, addToList, removeFromList, checkListStatus } = require('../controllers/listController');

const router = express.Router();

// "/status/:movieId" must come BEFORE "/:listType" to avoid "status" being parsed as listType
router.get('/status/:movieId', protect, movieIdParamValidator, validate, checkListStatus);
router.get('/:listType', protect, listTypeParamValidator, validate, getList);
router.post('/', protect, addToListValidator, validate, addToList);
router.delete('/:listType/:movieId', protect, listTypeParamValidator, movieIdParamValidator, validate, removeFromList);

module.exports = router;
