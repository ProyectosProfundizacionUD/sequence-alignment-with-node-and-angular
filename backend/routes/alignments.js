const router = require('express').Router();
const AlignmentController = require('../controllers/alignments');

router.post("/:filter?", AlignmentController.LocalAndGlobalAlignment);

module.exports = router;