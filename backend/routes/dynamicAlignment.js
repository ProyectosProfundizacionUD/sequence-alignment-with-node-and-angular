const router = require('express').Router();
const AlignmentController = require('../controllers/alignments');

router.post("/:filter?", AlignmentController.NeedlemanAndWunsch);

module.exports = router;