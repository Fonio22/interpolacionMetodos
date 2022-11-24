const GaussJordan = (Matriz) => {
  let n = Matriz.length;
  let matriz = Matriz;
  let x = [];
  let c = 0;
  let k = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i != j) {
        c = matriz[j][i] / matriz[i][i];
        for (k = 0; k < n + 1; k++) {
          matriz[j][k] = matriz[j][k] - c * matriz[i][k];
        }
      }
    }
  }

  for (let i = 0; i < n; i++) {
    x[i] = matriz[i][n] / matriz[i][i];
  }

  return x;
};

export default GaussJordan;
