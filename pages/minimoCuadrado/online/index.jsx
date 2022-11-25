import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import Latex from "react-latex";
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
import { MinimoCuadrado } from "../../../funcions/funcionsGlobal";

let arrayViejo = [];

export default function Index() {
  const [value, setValue] = useState(2);
  const [cuadrosX, setCuadrosX] = useState([]);
  const [cuadrosY, setCuadrosY] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [valoresXY, setValoresXY] = useState(null);
  const [grafica, setGrafica] = useState(null);

  const [usarEcuacion, setUsarEcuacion] = useState(false);
  const [cantEcua, setcantEcua] = useState([{ x: 0, y: 0 }]);

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
    if (usarEcuacion) {
      const timeout = setTimeout(() => {
        ObtenerValoresEcuacion();
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [watchEcuacion()]);

  useEffect(() => {
    GenerarInput();
  }, [value]);

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
      inputsX.push(parseFloat(data[`inputX_${i}`]));
      inputsY.push(parseFloat(data[`inputY_${i}`]));
      valoresGraficas.push({
        x: parseFloat(data[`inputX_${i}`]),
        y: parseFloat(data[`inputY_${i}`]),
      });
    }
    let resultado = MinimoCuadrado(inputsX, inputsY);
    let puntosGraficas = [];

    for (let i = 0; i < value; i++) {
      puntosGraficas.push({
        x: inputsX[i],
        y: resultado.a0 + resultado.a1 * inputsX[i],
      });
    }

    setResultado(resultado);
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
          x: arrayFloat[i],
          y: ecuacionRegresion(arrayFloat[i]),
        });
      }
      console.log("entro2");
      setcantEcua(arrayCalculo);
      // console.log(arrayCalculo);
    }
  };

  const ecuacionRegresion = (x) => {
    return resultado.a0 + resultado.a1 * x;
  };

  return (
    <Layout>
      <Container fluid="xl" className="pt-3">
        <h1>Mínimo cuadrado</h1>
        <div className="mt-4">
          <h6>
            Selecciona la cantidad de datos que deseas calcular por el método de
            mínimo cuadrado
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
                  setValue(4);
                  setFormValue("inputX_0", 10);
                  setFormValue("inputX_1", 12.5);
                  setFormValue("inputX_2", 20);
                  setFormValue("inputX_3", 30);
                  setFormValue("inputY_0", 400);
                  setFormValue("inputY_1", 500);
                  setFormValue("inputY_2", 600);
                  setFormValue("inputY_3", 900);
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
                  setResultado(null);
                  setValoresXY(null);
                  setGrafica(null);
                  setValue(2);
                  reset();
                  resetEcuacion();
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
              <p>
                y = {resultado.a0} + {resultado.a1}x
              </p>

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
                        <Latex>{`$ = ${item.y ? item.y : 0} $`}</Latex>
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

              <h6>Desviación</h6>
              <p>Sy = {resultado.tablaError.Desviación.Sy}</p>

              <h6>Error estándar</h6>
              <p>Syx = {resultado.tablaError.ErrorEstandar.Syx}</p>

              <h6>Coeficiente de determinación</h6>
              <p>R2 = {resultado.tablaError.CoeficienteDeterminacion * 100}%</p>

              <h6>Coeficiente de correlación</h6>
              <p>R = {resultado.tablaError.CoeficienteCorrelacion}</p>
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
                      { x: 0, y: 0 },
                      {
                        x: valoresXY[valoresXY.length - 1].x + 1,
                        y: valoresXY[valoresXY.length - 1].y + 1,
                      },
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
