import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CloseButton,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis,
} from "react-vis";
import Layout from "../../../components/Layout";
import GaussJordan from "../../../funcions/gaussGordan";
import Latex from "react-latex";

let arrayViejo = [];

export default function Index() {
  const [value, setValue] = useState(2);
  const [cuadrosX, setCuadrosX] = useState([]);
  const [cuadrosY, setCuadrosY] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [valoresXY, setValoresXY] = useState(null);
  const [grafica, setGrafica] = useState(null);

  const [usarEcuacion, setUsarEcuacion] = useState(false);
  const [cantEcua, setcantEcua] = useState([
    {
      x: 0,
      y: 0,
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue: setFormValue,
    reset,
  } = useForm();

  const {
    register: registerEcuacion,
    handleSubmit: handleSubmitEcuacion,
    formState: { errors: errorsEcuacion },
    setValue: setFormValueEcuacion,
    reset: resetEcuacion,
    watch: watchEcuacion,
    getValues: getValuesEcuacion,
  } = useForm();

  useEffect(() => {
    GenerarInput();
  }, [value]);

  useEffect(() => {
    if (usarEcuacion) {
      const timeout = setTimeout(() => {
        ObtenerValoresEcuacion();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [watchEcuacion()]);

  const GenerarInput = () => {
    let inputsX = [];
    let inputsY = [];

    for (let i = 0; i < value; i++) {
      inputsX.push(
        <td key={i}>
          <Form.Control
            type="number"
            step="any"
            placeholder="0"
            required={true}
            {...register(`inputX_${i}`)}
          />
        </td>
      );
      inputsY.push(
        <td key={i}>
          <Form.Control
            type="number"
            step="any"
            placeholder="0"
            required={true}
            {...register(`inputY_${i}`)}
          />
        </td>
      );
    }

    setCuadrosX(inputsX);
    setCuadrosY(inputsY);
  };

  const onSubmit = (data) => {
    let inputsX = [];
    let inputsY = [];
    let valoresGraficas = [];

    for (let i = 0; i < value; i++) {
      inputsX.push(data[`inputX_${i}`]);
      inputsY.push(data[`inputY_${i}`]);

      valoresGraficas.push({
        x: data[`inputX_${i}`],
        y: data[`inputY_${i}`],
      });
    }

    //calcular regresion polinomial

    let tabla = {
      x: {
        datos: inputsX,
        sumatoria: 0,
      },
      y: {
        datos: inputsY,
        sumatoria: 0,
      },
      xy: {
        datos: [],
        sumatoria: 0,
      },
      x2: {
        datos: [],
        sumatoria: 0,
      },
      x3: {
        datos: [],
        sumatoria: 0,
      },
      x4: {
        datos: [],
        sumatoria: 0,
      },
      x2y: {
        datos: [],
        sumatoria: 0,
      },
    };

    for (let i = 0; i < value; i++) {
      tabla.x.sumatoria += parseFloat(inputsX[i]);
      tabla.y.sumatoria += parseFloat(inputsY[i]);

      tabla.xy.datos.push(inputsX[i] * inputsY[i]);
      tabla.xy.sumatoria += tabla.xy.datos[i];

      tabla.x2.datos.push(Math.pow(inputsX[i], 2));
      tabla.x2.sumatoria += tabla.x2.datos[i];

      tabla.x3.datos.push(Math.pow(inputsX[i], 3));
      tabla.x3.sumatoria += tabla.x3.datos[i];

      tabla.x4.datos.push(Math.pow(inputsX[i], 4));
      tabla.x4.sumatoria += tabla.x4.datos[i];

      tabla.x2y.datos.push(Math.pow(inputsX[i], 2) * inputsY[i]);
      tabla.x2y.sumatoria += tabla.x2y.datos[i];
    }

    const matrizGuass = [
      [value, tabla.x.sumatoria, tabla.x2.sumatoria, tabla.y.sumatoria],
      [
        tabla.x.sumatoria,
        tabla.x2.sumatoria,
        tabla.x3.sumatoria,
        tabla.xy.sumatoria,
      ],
      [
        tabla.x2.sumatoria,
        tabla.x3.sumatoria,
        tabla.x4.sumatoria,
        tabla.x2y.sumatoria,
      ],
    ];

    const x = GaussJordan(matrizGuass);

    //calcular el error estandar

    let error = 0;

    for (let i = 0; i < value; i++) {
      error += Math.pow(
        inputsY[i] -
          (x[0] + x[1] * inputsX[i] + x[2] * Math.pow(inputsX[i], 2)),
        2
      );
    }

    const error1 = Math.sqrt(error / (value - 3));

    //calcular el coeficiente de determinacion

    let coeficiente = 0;

    for (let i = 0; i < value; i++) {
      coeficiente += Math.pow(inputsY[i] - tabla.y.sumatoria / value, 2);
    }

    coeficiente = Math.sqrt((coeficiente - error) / coeficiente);

    const resultados = {
      a0: x[0],
      a1: x[1],
      a2: x[2],
      errorEstandar: error1,
      coeficienteDeterminacion: coeficiente,
    };

    //grafica lineal
    let puntosGraficas = [];

    for (let i = 0; i < value; i++) {
      puntosGraficas.push({
        x: inputsX[i],
        y:
          resultados.a0 +
          resultados.a1 * inputsX[i] +
          resultados.a2 * Math.pow(inputsX[i], 2),
      });
    }

    setResultado(resultados);
    setValoresXY(valoresGraficas);
    setGrafica(puntosGraficas);
  };

  const ObtenerValoresEcuacion = () => {
    const valores = getValuesEcuacion();
    console.log(valores);
    let array = Object.values(valores);

    //convetir a float
    let arrayFloat = [];
    for (let i = 0; i < array.length; i++) {
      const m = parseFloat(array[i]);
      if (!isNaN(m)) {
        arrayFloat[i] = m;
      } else {
        arrayFloat[i] = 0;
      }
    }

    if (arrayFloat.length > 0) {
      let arrayCalculo = [];
      arrayViejo = arrayFloat;
      for (let i = 0; i < arrayFloat.length; i++) {
        arrayCalculo.push({
          x: arrayFloat[0],
          y: ecuacionRegresion(arrayFloat[i]),
        });
      }
      console.log("entro2");
      setcantEcua(arrayCalculo);
      // console.log(arrayCalculo);
    }
  };

  const ecuacionRegresion = (x) => {
    return resultado.a0 + resultado.a1 * x + resultado.a2 * Math.pow(x, 2);
  };

  return (
    <Layout>
      <Container fluid="xl" className="pt-3">
        <h1>Regresión polinomial</h1>

        <div className="mt-4">
          <h6>
            Selecciona la cantidad de datos que deseas calcular por regresión
            polinomial
          </h6>
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => setValue(parseInt(e.target.value))}
            value={value}
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </Form.Select>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4">
            <Table striped bordered responsive>
              <tbody>
                <tr>
                  <td>y</td>
                  {cuadrosY}
                </tr>
                <tr>
                  <td>x</td>
                  {cuadrosX}
                </tr>
              </tbody>
            </Table>
          </div>
          <div
            className="d-flex"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <div className="d-grid gap-2" style={{ width: "30%" }}>
              <Button variant="primary" type="submit">
                Calcular
              </Button>
            </div>
            <div className="d-grid gap-2" style={{ width: "30%" }}>
              <Button
                variant="success"
                onClick={() => {
                  setValue(6);
                  setFormValue("inputX_0", 10);
                  setFormValue("inputX_1", 25);
                  setFormValue("inputX_2", 29);
                  setFormValue("inputX_3", 35);
                  setFormValue("inputX_4", 47);
                  setFormValue("inputX_5", 50);
                  setFormValue("inputY_0", 5);
                  setFormValue("inputY_1", 14.5);
                  setFormValue("inputY_2", 22.9);
                  setFormValue("inputY_3", 30.4);
                  setFormValue("inputY_4", 41);
                  setFormValue("inputY_5", 45.7);
                }}
                type="submit"
              >
                Ejemplo
              </Button>
            </div>
            <div className="d-grid gap-2" style={{ width: "30%" }}>
              <Button
                variant="danger"
                onClick={() => {
                  setValue(2);
                  setResultado(null);
                  setValoresXY(null);
                  setGrafica(null);
                  setUsarEcuacion(false);
                  reset();
                  resetEcuacion();
                  setcantEcua([
                    {
                      x: 0,
                      y: 0,
                    },
                  ]);
                }}
              >
                Resetear
              </Button>
            </div>
          </div>
        </Form>

        {resultado && (
          <Container className="border mt-4 p-3 mb-5">
            <h4>Resultado</h4>
            <div className="mt-4">
              <h6>La ecuación</h6>

              <div className="mb-2">
                <p>{`y = ${resultado.a0.toFixed(4)} ${
                  resultado.a1 > 0 ? ` + ${resultado.a1}` : resultado.a1
                }x ${
                  resultado.a2 > 0 ? ` + ${resultado.a2}` : resultado.a2
                }x^2`}</p>
              </div>
              <p>
                <a
                  className="pe-auto"
                  onClick={() => setUsarEcuacion(!usarEcuacion)}
                  style={{ cursor: "pointer" }}
                >
                  Usar esta ecuación
                </a>
              </p>

              {usarEcuacion && (
                <Container className="mb-2 border p-3">
                  {cantEcua.map((item, index) => (
                    <div className="d-flex mb-3" key={index}>
                      <InputGroup className="" style={{ maxWidth: 150 }}>
                        <InputGroup.Text id="basic-addon1">x</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="any"
                          placeholder="0"
                          required={true}
                          {...registerEcuacion(`input_ecuacion_X_${index}`)}
                        />
                      </InputGroup>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: 10,
                        }}
                      >
                        <p>{` = ${item.y ? item.y : 0}`}</p>
                      </div>
                    </div>
                  ))}

                  <div>
                    <Button
                      variant="info"
                      className="text-white"
                      onClick={() =>
                        setcantEcua([
                          ...cantEcua,
                          {
                            x: 0,
                            y: 0,
                          },
                        ])
                      }
                    >
                      Agregar +
                    </Button>
                  </div>
                </Container>
              )}

              <h6>Error estandar</h6>
              <p>Sy/x = {resultado.errorEstandar}</p>

              <h6>Coeficiente de determinación</h6>
              <p>
                r^2
                {(resultado.coeficienteDeterminacion * 100).toFixed(2)}%
              </p>

              <h6>Coeficiente de correlación</h6>
              <p>r = {resultado.coeficienteDeterminacion}</p>
            </div>

            <div className="mt-3">
              <h5 className="">Gráfica</h5>
              <Card style={{ width: 650 }} className="p-3">
                <XYPlot width={600} height={300}>
                  <VerticalGridLines />
                  <HorizontalGridLines />
                  <XAxis />
                  <YAxis />
                  <LineSeries
                    data={grafica}
                    color="black"
                    style={{ strokeWidth: "1px", fill: "none" }}
                  />
                  {valoresXY.map((item, index) => {
                    return (
                      <MarkSeries key={index} data={[item]} color="blue" />
                    );
                  })}
                  {usarEcuacion && <MarkSeries data={cantEcua} color="red" />}

                  <MarkSeries
                    data={[
                      { x: valoresXY[0].x, y: 0 },
                      // {
                      //   x: valoresXY[valoresXY.length - 1].x + 1,
                      //   y: valoresXY[valoresXY.length - 1].y + 1,
                      // },
                    ]}
                    style={{ display: "none" }}
                  />
                </XYPlot>
              </Card>
            </div>
          </Container>
        )}
      </Container>
    </Layout>
  );
}
