const Sequence = require('../models/sequence');

const createSequence = async (req, res) => {
  if (
    !req.body.sequence ||
    !req.body.description ||
    !req.body.imgUrl
  )
    res.status(400).send("Error: you need to send all fields!");

  const lines = req.body.sequence.split("\n");

  if (
    lines[0] == null ||
    lines[0] == undefined ||
    lines[1] == null ||
    lines[1] == undefined
  )
    res.status(400).send("Error invalid format, must be FASTA");

  const entryHead = lines[0];
  
  const entryIdentifier = entryHead.split("|")[1];

  if (entryIdentifier == undefined || entryIdentifier == null)
    res.status(400).send("Error invalid format, must be FASTA with GI");

  let entryOrganism =
    req.body.organism != undefined
      ? req.body.organism
      : entryHead.split("|")[4].split(",")[0];

  let entrySequence = lines[1].substring(0, 60);

  const isDuplicated = await Sequence.findOne({ identifier: entryIdentifier });
  if(isDuplicated) return res.status(409).send("The sequence is already created");

  const sequence = new Sequence({
      organism: entryOrganism,
      identifier: entryIdentifier,
      head: entryHead,
      sequence: entrySequence,
      description: req.body.description,
      length: entrySequence.length,
      imgUrl: req.body.imgUrl
    });

    const result = await sequence.save();
    if(!result) res.status(400).send('Error to save the sequence');

  res.status(201).send(result);
}
const getSequences = async (req, res) => {
  const results = await Sequence.find({
    $or: [
      { organism: new RegExp(req.params["filter"], "i") },
      { identifier: new RegExp(req.params["filter"], "i") }
    ],
  }).exec();
  if (!results || results.length === 0)
    return res.status(400).send("No search results");
  return res.status(200).send( results );
}
const deleteSequence = async (req, res) => {}

module.exports = { createSequence, getSequences, deleteSequence };