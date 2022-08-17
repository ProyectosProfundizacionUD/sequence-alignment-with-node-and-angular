const Sequence = require("../models/sequence");
const Methods = require("../Methods/alignmentMethods");

const LocalAndGlobalAlignment = (req, res) => {
  var headers = req.headers;
  var organism = req.body.organism;
  var sequence = req.body.sequence;

  if (!sequence || sequence === "")
    return res.status(400).send({error: "You must send a valid sequence"});

  //validar  con expresion regular

  sequence = sequence.toUpperCase();

  ValidateHeaders(headers) == true
    ? LocalAlignment(headers, sequence, organism, res, req.params["filter"])
    : GlobalAlignment(sequence, organism, res, req.params["filter"]);
};

const ValidateHeaders = (headers) => {
  if (headers["x1"] && headers["x2"] && headers["y1"] && headers["y2"])
    if (
      Number.parseInt(headers["x1"]) <= Number.parseInt(headers["x2"]) &&
      Number.parseInt(headers["y1"]) <= Number.parseInt(headers["y2"])
    )
      return true;
  return false;
};

const LocalAlignment = async (headers, sequence, organism, res, filter) => {
  let sequences = await Sequence.find({ identifier: new RegExp(filter, "i") });

  if (!sequences || sequences.length === 0)
    return res.status(500).send({error: "an error was happen while we get the data"});

  let lowerSize = 60;
  sequences.forEach(chain => {
    if(chain.sequence.length < lowerSize)
      lowerSize = chain.sequence.length;
  });

  if (
    parseInt(headers["x2"]) > sequence.length ||
    parseInt(headers["y2"]) > lowerSize - 1
  )
    return res
      .status(400)
      .send({error: "El rango debe ser menor al tamaño de la sequencia"});
  
  //get the subsequences from the headers range
  sequence = sequence.substring(
    parseInt(headers["x1"]),
    parseInt(headers["x2"]) + 1
  );
  sequences.forEach((seq) => {
    seq.sequence = seq.sequence.substring(
      parseInt(headers["y1"]),
      parseInt(headers["y2"]) + 1
    );
  });
  
  let size = sequence.length;

  if (
    Number.parseInt(headers["x2"]) - Number.parseInt(headers["x1"]) <
    Number.parseInt(headers["y2"]) - Number.parseInt(headers["y1"])
  ) {
    let lengthToApply =
      Number.parseInt(headers["y2"]) -
      Number.parseInt(headers["y1"]) -
      (Number.parseInt(headers["x2"]) - Number.parseInt(headers["x1"]));

    for (let i = 0; i < lengthToApply; i++) {
      sequence += " ";
    }
  } else {
    let lengthToApply =
      Number.parseInt(headers["x2"]) -
      Number.parseInt(headers["x1"]) -
      (Number.parseInt(headers["y2"]) - Number.parseInt(headers["y1"]));

    sequences.forEach((seq) => {
      for (let j = 0; j < lengthToApply; j++) {
        seq.sequence += " ";
      }
    });
  }

  let result = {
    organism: organism,
    sequence: sequence,
    size: size,
    results: [],
  };

  let tempResult = "";
  let tempScore = 0;
  let sameSize = false;
  for (let i = 0; i < sequences.length; i++) {
    if (sequences[i].sequence.length == size) sameSize = true;
    for (let j = 0; j < sequence.length; j++) {
      if (sequence[j] == sequences[i].sequence[j]) {
        tempResult += "1";
        tempScore += 1;
      } else {
        tempResult += "0";
      }
    }
    result.results.push({
      organism: sequences[i].organism,
      sequence: sequences[i].sequence,
      alignment: tempResult,
      score: tempScore,
      sameSize: sameSize,
      size: sequences[i].sequence.length
    });
    tempResult = "";
    tempScore = 0;
    sameSize = false;
  }
  result.results = result.results.sort((a, b) => b.score - a.score);

  return res.status(200).send(result);
};

const GlobalAlignment = async (sequence, organism, res, filter) => {
  let sequences = await Sequence.find({ identifier: new RegExp(filter, "i") });
  if (!sequences || sequences.length === 0)
    return res.status(500).send({error: "an error was happen while we get the data"});

  // validamos que el tamaño de la secuencia sea igual al tamaño estandar
  // de las secuencias almacenadas, de no serlo, le concatenamos campos vacios
  // hasta completar un tamaño igual a "60"
  let size = sequence.length;
  if (size < 60) {
    let lengthToApply = 60 - size;
    for (let i = 0; i < lengthToApply; i++) {
      sequence += " ";
    }
  }

  let result = {
    organism: organism,
    sequence: sequence,
    size: size,
    results: [],
  };

  let tempResult = "";
  let tempScore = 0;
  let sameSize = false;
  for (let i = 0; i < sequences.length; i++) {
    if (sequences[i].sequence.length == size) sameSize = true;
    for (let j = 0; j < sequence.length; j++) {
      if (sequence[j] == sequences[i].sequence[j]) {
        tempResult += "1";
        tempScore += 1;
      } else {
        tempResult += "0";
      }
    }
    result.results.push({
      organism: sequences[i].organism,
      sequence: sequences[i].sequence,
      alignment: tempResult,
      score: tempScore,
      sameSize: sameSize,
      size: sequences[i].sequence.length
    });
    tempResult = "";
    tempScore = 0;
    sameSize = false;
  }
  result.results = result.results.sort((a, b) => b.score - a.score);

  return res.status(200).send(result);
};

const NeedlemanAndWunsch = async (req, res) => {
  let organism = req.body.organism;
  let sequence = req.body.sequence;
  let gaps = req.body.gaps;
  let coincidence = req.body.coincidence;
  let difference = req.body.difference;
  let identifier = req.params["filter"];

  if (!sequence || sequence === "")
    return res.status(400).send({error: "You must send a valid sequence"});

  if (
    !coincidence ||
    coincidence === "" ||
    !difference ||
    difference === "" ||
    !gaps ||
    gaps === ""
  )
    return res.status(400).send({error: "You need to send all fields"});

  sequence = sequence.toUpperCase();

  let sequenceToAlign = await Sequence.findOne({
    identifier: new RegExp(identifier, "i"),
  });
  if (!sequenceToAlign || sequenceToAlign.length === 0)
    return res.status(500).send({error: "an error was happen while we get the data"});

  let matrix = Methods.buildNeedlemanMatrix(
    sequence,
    sequenceToAlign.sequence,
    gaps
  );

  matrix = Methods.resolveNeedlemanMatrix(matrix, coincidence, difference);

  let alignmentPath = Methods.buildTraceBack(
    matrix,
    coincidence,
    difference,
    gaps
  );

  return res.status(201).send({
    traceBack: [
      {
        organism: organism,
        sequence: alignmentPath[0][0],
        size: sequence.length,
      },
      {
        organism: sequenceToAlign.organism,
        sequence: alignmentPath[0][1],
        size: sequenceToAlign.sequence.length,
      },
    ],
    score: alignmentPath[2],
    traceBackPositions: alignmentPath[1],
    matrix: matrix,
  });
};

const DotPlot = async (req, res) => {
  var headers = req.headers;
  let organism = req.body.organism;
  let sequence = req.body.sequence;
  let identifier = req.params["filter"];

  if (!sequence || sequence === "")
    return res.status(400).send({error: "You must send a valid sequence"});

  sequence = sequence.toUpperCase();

  let sequenceToAlign = await Sequence.findOne({
    identifier: new RegExp(identifier, "i"),
  });
  if (!sequenceToAlign || sequenceToAlign.length === 0)
    return res.status(500).send({error: "an error was happen while we get the data"});

  if (ValidateHeaders(headers)) {
    if (
      parseInt(headers["x2"]) > sequence.length ||
      parseInt(headers["y2"]) > sequenceToAlign.sequence.length
    )
      return res
        .status(400)
        .send({error: "the range must be lower than the sequence length"});
    sequence = sequence.substring(
      parseInt(headers["x1"]),
      parseInt(headers["x2"]) + 1
    );
    sequenceToAlign.sequence = sequenceToAlign.sequence.substring(
      parseInt(headers["y1"]),
      parseInt(headers["y2"]) + 1
    );
  }

  let matrix = Methods.buildDotplotMatrix(sequence, sequenceToAlign.sequence);

  return res.status(200).send({
    info: [
      {
        organism: organism,
        size: sequence.length,
      },
      {
        organism: sequenceToAlign.organism,
        size: sequenceToAlign.sequence.length,
      },
    ],
    matrix,
  });
};

module.exports = { LocalAndGlobalAlignment, NeedlemanAndWunsch, DotPlot };
