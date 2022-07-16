const router = require('express').Router();
const SequenceController = require('../controllers/sequence');

router.post('/', SequenceController.createSequence);
router.get('/', SequenceController.getSequences);
router.delete('/', SequenceController.deleteSequence)

module.exports = router;