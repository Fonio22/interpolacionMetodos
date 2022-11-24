import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
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
import { MinimoCuadrado } from "../../../funcions/funcionsGlobal";

export default function index() {
  const [value, setValue] = useState(2);
  const [cuadrosX, setCuadrosX] = useState([]);
  const [cuadrosY, setCuadrosY] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [valoresXY, setValoresXY] = useState(null);
  const [lineaTendencia, setLineaTendencia] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue: setFormValue,
  } = useForm();

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

    let h = (inputsX[inputsX.length - 1] - inputsX[0]) / 3;

    let sum = 0;
    for (let i = 1; i < inputsX.length - 1; i++) {
      sum += 3 * inputsY[i];
    }

    const result =
      ((3 * h) / 8) * (inputsY[0] + sum + inputsY[inputsY.length - 1]);

    let Vr = Math.log(inputsX[inputsX.length - 1]) - Math.log(inputsX[0]);
    let Ev = Math.abs(Vr - result);

    let resultado = MinimoCuadrado(inputsX, inputsY);
    let puntosGraficas = [];

    for (let i = 0; i < value; i++) {
      puntosGraficas.push({
        x: inputsX[i],
        y: resultado.a0 + resultado.a1 * inputsX[i],
      });
    }

    setResultado({
      result,
      Ev,
    });
    setValoresXY(valoresGraficas);

    setLineaTendencia(puntosGraficas);
  };

  return (
    <Layout>
      <Container fluid="xl" className="pt-3">
        <h1>Regla de Simpson</h1>

        <div className="mt-4">
          <h6>
            Selecciona la cantidad de datos que deseas calcular por el metodo de
            Simpson
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
                  <td>f(x)</td>
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
                  setFormValue("inputX_0", 2);
                  setFormValue("inputX_1", 3.67);
                  setFormValue("inputX_2", 5.33);
                  setFormValue("inputX_3", 7);
                  setFormValue("inputY_0", 0.5);
                  setFormValue("inputY_1", 0.2727272727);
                  setFormValue("inputY_2", 0.1875);
                  setFormValue("inputY_3", 0.14285714);
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
                  reset();
                  setResultado(null);
                  setValoresXY(null);
                  setValue(2);
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
            <p>El resultado es: {resultado.result}</p>
            <p>El error verdadero es: {resultado.Ev}</p>
            <div className="mt-3">
              <h5 className="">Grafica</h5>
              <Card className="p-3" style={{ width: 450 }}>
                <XYPlot width={400} height={400}>
                  <VerticalGridLines />
                  <HorizontalGridLines />
                  <XAxis />
                  <YAxis />
                  <LineSeries
                    data={valoresXY}
                    color="red"
                    style={{ strokeWidth: "3px", fill: "none" }}
                  />

                  <LineSeries
                    data={lineaTendencia}
                    color="blue"
                    style={{
                      strokeWidth: "1px",
                      fill: "none",
                      strokeDasharray: "2,2",
                    }}
                  />

                  <MarkSeries
                    data={[
                      { x: 0, y: 0 },
                      {
                        x: valoresXY[valoresXY.length - 1].x + 0.5,
                        y: valoresXY[valoresXY.length - 1].y + 0.5,
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
