const router = require('express').Router();
const AlignmentController = require('../controllers/alignments');

router.post("/", AlignmentController.LocalAndGlobalAlignment);

module.exports = router;