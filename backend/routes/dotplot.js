const router = require('express').Router();
const AlignmentController = require('../controllers/alignments');

router.post("/:filter?", AlignmentController.DotPlot);

module.exports = router;