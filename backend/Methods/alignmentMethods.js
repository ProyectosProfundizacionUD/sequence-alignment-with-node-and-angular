const buildNeedlemanMatrix = (entrySequence, dbSequence, gaps) => {
  let matrix = [];
  let tempMatrix = [];
  for (let i = 0; i < dbSequence.length + 2; i++) {
    for (let j = 0; j < entrySequence.length + 2; j++) {
      if (i == 0 && j == 0) {
        tempMatrix.push("i/j");
      } else if (i == 0 && j == 1) {
        tempMatrix.push("-");
      } else if (i == 0) {
        tempMatrix.push(entrySequence[j - 2]);
      } else if (i == 1 && j == 0) {
        tempMatrix.push("-");
      } else if (j == 0) {
        tempMatrix.push(dbSequence[i - 2]);
      } else if (j == 1 && i == 1) {
        tempMatrix.push(0);
      } else if (j == 1 && i > 1) {
        tempMatrix.push(matrix[i - 1][1] + gaps);
      } else if (i == 1 && j > 1) {
        tempMatrix.push(tempMatrix[j - 1] + gaps);
      } else {
        tempMatrix.push(0);
      }
    }
    matrix.push(tempMatrix);
    tempMatrix = [];
  }
  return matrix;
};

const resolveNeedlemanMatrix = (matrix, coincidence, difference) => {
  for (let i = 2; i < matrix.length; i++) {
    for (let j = 2; j < matrix[0].length; j++) {
      if (matrix[i][0] == matrix[0][j]) {
        matrix[i][j] = takeBigger(
          coincidence,
          matrix[i - 1][j - 1], //diagonal
          matrix[i - 1][j], // left
          matrix[i][j - 1] // up
        );
      } else {
        matrix[i][j] = takeBigger(
          difference,
          matrix[i - 1][j - 1], //diagonal
          matrix[i - 1][j], // left
          matrix[i][j - 1] // up
        );
      }
    }
  }
  return matrix;
};
const takeBigger = (s, dg, left, up) => {
  let tempArray = [];
  tempArray.push(dg + s, left + s, up + s);
  return (selectedValue = Math.max(...tempArray));
};
const takeBiggerPosition = (i, j, matrix) => {
  let result = [];
  let tempArray = [
    matrix[i - 1][j - 1], //diagonal
    matrix[i - 1][j], // left
    matrix[i][j - 1], // up
  ];
  let selectedValue = Math.max(...tempArray);
  let indexSelected = tempArray.findIndex((value) => value == selectedValue);

  if(i != 2 && j != 2) {
    result = doACase(indexSelected, matrix, i, j);
  } else if (i == 2 && j == 2) {
    result = doACase(0, matrix, i, j);
  } else if (i == 2) {
    result = doACase(2, matrix, i, j);
  } else if (j == 2) {
    result = doACase(1, matrix, i, j);
  }
  
  return [result[0], result[1], result[2], result[3]];
};
const doACase = (indexSelected, matrix, i, j) => {
  let newI = 0;
  let newJ = 0;
  let FromDbSequence = "";
  let entrySequence = "";
  switch (indexSelected) {
    case 0:
      newI = i - 1;
      newJ = j - 1;
      FromDbSequence = matrix[i][0];
      entrySequence = matrix[0][j];
      break;
    case 1:
      newI = i - 1;
      newJ = j;
      FromDbSequence = matrix[i][0];
      entrySequence = "-";
      break;
    case 2:
      newI = i;
      newJ = j - 1;
      FromDbSequence = "-";
      entrySequence = matrix[0][j];
      break;
  }
  return [newI, newJ, entrySequence, FromDbSequence];
}
const buildTraceBack = (matrix, coincidence, difference, gaps) => {
  let entrySequence = "";
  let dbSequence = "";
  let condition = false;
  let i = matrix.length - 1,
    j = matrix[0].length - 1;
  let positionList = [];
  positionList.push([i, j]);
  do {
    if (i == 2 && j == 2) condition = true;
    let result = takeBiggerPosition(i, j, matrix);
    // *replace the original values
    i = result[0];
    j = result[1];
    entrySequence += result[2];
    dbSequence += result[3];
    if (!condition) positionList.push([i, j]);
  } while (!condition);
  entrySequence = reverseString(entrySequence);
  dbSequence = reverseString(dbSequence);
  return [
    [entrySequence, dbSequence],
    positionList,
    getScore(entrySequence, dbSequence, coincidence, difference, gaps),
  ];
};
const getScore = (entrySequence, dbSequence, coincidence, difference, gaps) => {
  let score = 0;
  for (let i = 0; i < entrySequence.length; i++) {
    if(entrySequence[i] == "-" || dbSequence[i] == "-"){
      score += gaps;
    } else if (entrySequence[i] == dbSequence[i]) {
      score += coincidence;
    } else if (entrySequence[i] != dbSequence[i]) {
      score += difference;
    }
  }
  return score;
};
const reverseString = (cad) => {
  return cad.split("").reverse().join("");
};

module.exports = {
  buildNeedlemanMatrix,
  resolveNeedlemanMatrix,
  buildTraceBack,
};
