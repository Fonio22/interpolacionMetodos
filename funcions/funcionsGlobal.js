const MinimoCuadrado = (inputsX, inputsY) => {
  const value = inputsX.length;
  let tablasMinimosCuadrados = {
    x: {
      x: [],
      sumatoria: 0,
    },
    y: {
      y: [],
      sumatoria: 0,
    },
    xy: {
      xy: [],
      sumatoria: 0,
    },
    x2: {
      x2: [],
      sumatoria: 0,
    },
  };

  for (let i = 0; i < value; i++) {
    tablasMinimosCuadrados.x.x.push(inputsX[i]);
    tablasMinimosCuadrados.x.sumatoria += inputsX[i];
    tablasMinimosCuadrados.y.y.push(inputsY[i]);
    tablasMinimosCuadrados.y.sumatoria += inputsY[i];
    tablasMinimosCuadrados.xy.xy.push(inputsX[i] * inputsY[i]);
    tablasMinimosCuadrados.xy.sumatoria += inputsX[i] * inputsY[i];
    tablasMinimosCuadrados.x2.x2.push(inputsX[i] * inputsX[i]);
    tablasMinimosCuadrados.x2.sumatoria += inputsX[i] * inputsX[i];
  }

  const Ymedio = tablasMinimosCuadrados.y.sumatoria / value;
  const Xmedio = tablasMinimosCuadrados.x.sumatoria / value;

  let a1 =
    (value * tablasMinimosCuadrados.xy.sumatoria -
      tablasMinimosCuadrados.x.sumatoria * tablasMinimosCuadrados.y.sumatoria) /
    (value * tablasMinimosCuadrados.x2.sumatoria -
      Math.pow(tablasMinimosCuadrados.x.sumatoria, 2));

  let a0 = Ymedio - a1 * Xmedio;

  let tablaError = {
    Desviación: {
      DesviaciónArray: [],
      St: 0,
      Sy: 0,
    },
    ErrorEstandar: {
      ErrorEstandarArray: [],
      Sr: 0,
      Syx: 0,
    },
    CoeficienteDeterminacion: 0,
    CoeficienteCorrelacion: 0,
  };

  for (let i = 0; i < value; i++) {
    tablaError.Desviación.DesviaciónArray.push(
      Math.pow(inputsY[i] - Ymedio, 2)
    );

    tablaError.Desviación.St += Math.pow(inputsY[i] - Ymedio, 2);

    tablaError.ErrorEstandar.ErrorEstandarArray.push(
      Math.pow(inputsY[i] - a0 - a1 * inputsX[i], 2)
    );

    tablaError.ErrorEstandar.Sr += Math.pow(
      inputsY[i] - a0 - a1 * inputsX[i],
      2
    );
  }

  tablaError.Desviación.Sy = Math.sqrt(tablaError.Desviación.St / (value - 1));

  tablaError.ErrorEstandar.Syx = Math.sqrt(
    tablaError.ErrorEstandar.Sr / (value - 2)
  );

  tablaError.CoeficienteDeterminacion =
    (tablaError.Desviación.St - tablaError.ErrorEstandar.Sr) /
    tablaError.Desviación.St;

  tablaError.CoeficienteCorrelacion = Math.sqrt(
    tablaError.CoeficienteDeterminacion
  );

  const ArrayResultados = {
    a0: a0,
    a1: a1,
    tablasMinimosCuadrados,
    tablaError,
  };
  return ArrayResultados;
};

export { MinimoCuadrado };
