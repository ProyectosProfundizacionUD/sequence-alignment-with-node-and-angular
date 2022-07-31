const Sequence = require("../models/sequence");

const LocalAndGlobalAlignment = (req, res) => {
  var headers = req.headers;
  var organism = req.body.organism;
  var sequence = req.body.sequence;

  if (!sequence || sequence === "")
    return res.status(400).send("You must send a valid sequence");

  //validar  con expresion regular

  //pasar a uppercase
  sequence = sequence.toUpperCase()

  ValidateHeaders(headers) == true
    ? LocalAlignment(headers, sequence, organism, res)
    : GlobalAlignment(sequence, organism, res);
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

const LocalAlignment = async (headers, sequence, organism, res) => {
  let sequences = await Sequence.find();
  if (!sequences || sequences.length === 0)
    return res.status(500).send("an error was happen while we get the data");

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
    results: [],
  };

  let tempResult = "";
  let tempScore = 0;
  let sameSize = false;
  for (let i = 0; i < sequences.length; i++) {
    if(sequences[i].sequence.length == size)
      sameSize = true;
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
    });
    tempResult = "";
    tempScore = 0;
    sameSize = false;
  }
  result.results = result.results.sort(((a, b) => b.score - a.score));
  
  return res.status(200).send(result);
};

const GlobalAlignment = async (sequence, organism, res) => {
  let sequences = await Sequence.find();
  if (!sequences || sequences.length === 0)
    return res.status(500).send("an error was happen while we get the data");

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
    results: [],
  };

  let tempResult = "";
  let tempScore = 0;
  let sameSize = false;
  for (let i = 0; i < sequences.length; i++) {
    if(sequences[i].sequence.length == size)
      sameSize = true;
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
    });
    tempResult = "";
    tempScore = 0;
    sameSize = false;
  }
  result.results = result.results.sort(((a, b) => b.score - a.score));

  return res.status(200).send(result);
};

module.exports = { LocalAndGlobalAlignment };
