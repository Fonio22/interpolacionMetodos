import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Layout from "../../../components/Layout";
import formulaTrapecio from "../../../images/formulaTrapecio.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries,
  MarkSeries,
  AreaSeries,
  VerticalGridLines,
  DecorativeAxis,
} from "react-vis";
import { Store } from "react-notifications-component";

const schema = yup
  .object()
  .shape({
    a: yup
      .number("Este campo debe ser número")
      .required("Este campo es requerido"),
    b: yup
      .number("Este campo debe ser número")
      .required("Este campo es requerido"),
    n: yup
      .number("Este campo debe ser número")
      .required("Este campo es requerido"),
  })
  .required();

export default function index() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [resultData, setResultData] = useState(null);
  const [errorTrapezoidal, setErrorTrapezoidal] = useState(null);
  const [datosCurvas, setDatosCurvas] = useState(null);
  const [GraficaTrapezoidal, setGraficaTrapezoidal] = useState(null);

  // useEffect(() => {
  //   if (watch("a") && watch("b") && watch("n")) {
  //     console.log("entro1");
  //     handleSubmit(() =>
  //       onSubmit({
  //         a: watch("a"),
  //         b: watch("b"),
  //         n: watch("n"),
  //       })
  //     );
  //   }
  // }, [watch("a"), watch("b"), watch("n")]);

  const onSubmit = (data) => {
    const { a, b, n } = data;

    if (a >= b) {
      Store.addNotification({
        title: "Error",
        message: "El límite inferior debe ser menor al límite superior",
        type: "danger",
        insert: "top",
        container: "top-right",
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
      return;
    }

    const h = (b - a) / n;
    let sum = 0;

    for (let i = 1; i < n; i++) {
      sum += formula(a + i * h);
    }

    const result = (h / 2) * (formula(a) + 2 * sum + formula(b));
    setResultData(result);

    //calculate error trapzoidal
    const error = Math.pow(b - a, 3) / (12 * Math.pow(n, 2));

    let array = [];
    // for (let i = 0; i < b + 0.5; i = i + n) {
    for (let i = 0; i < b + 0.5; i = i + 0.1) {
      array.push({ x: i, y: formula(i) });
    }

    //graficas

    let arrayGraficas = [];
    arrayGraficas.push({ x: a, y: formula(parseInt(getValues("a"))) });
    for (let i = 1; i < n; i++) {
      arrayGraficas.push({ x: a + i * h, y: formula(a + i * h) });
    }
    arrayGraficas.push({ x: b, y: formula(parseInt(getValues("b"))) });

    setDatosCurvas(array);
    setGraficaTrapezoidal(arrayGraficas);
    setErrorTrapezoidal(error);
  };

  return (
    <Layout>
      <Container fluid="xl" className="pt-3">
        <h1>Regla Trapezoidal</h1>
        <div className="mt-4">
          <h6>
            Fórmula para las calcular desplazamiento de un nuevo prototipo de
            cohete.
          </h6>
          <Image
            src={formulaTrapecio}
            width={200}
            height={150}
            alt="fórmula de trapezoide"
          />
        </div>
        <div
          style={{
            height: 0.5,
            width: "100%",
            backgroundColor: "gray",
            marginTop: 20,
            marginBottom: 20,
          }}
        />
        <Container>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>a (límite inferior)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese un número"
                    {...register("a")}
                    isInvalid={!!errors.a}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.a?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>b (límite superior)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese un número"
                    {...register("b")}
                    isInvalid={!!errors.b}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.b?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad n de intervalos</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingrese un número"
                    {...register("n")}
                    isInvalid={!!errors.n}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.n?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

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
                    setValue("a", 1);
                    setValue("b", 2);
                    setValue("n", 1);
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
                    setResultData(null);
                    setErrorTrapezoidal(null);
                    setDatosCurvas(null);
                    reset();
                  }}
                >
                  Resetear
                </Button>
              </div>
            </div>
          </Form>
        </Container>
        {resultData && (
          <Container className="border mt-4 p-3 mb-5">
            <h4>Resultado</h4>
            <div>
              Entre los intervalos de tiempo de {getValues("a")} segundo y{" "}
              {getValues("b")} segundos, el cohete se habrá desplazado
              aproximadamente unos {resultData} Km.
            </div>
            <h5 className="mt-3">Error trapezoidal</h5>
            <p>{errorTrapezoidal}</p>

            <div className="mt-3">
              <h5 className="">Gráfica</h5>
              <Card className="p-3" style={{ width: 450 }}>
                <XYPlot width={400} height={400}>
                  <VerticalGridLines />
                  <HorizontalGridLines />
                  <XAxis />
                  <YAxis />

                  <AreaSeries
                    color="#007bff"
                    className="area-series-example"
                    curve="curveNatural"
                    data={GraficaTrapezoidal}
                  />

                  {/* realizar una grafica con curva */}
                  <LineSeries
                    color="black"
                    className="area-series-example"
                    curve="curveNatural"
                    style={{
                      fill: "none",
                      strokeWidth: 1,
                    }}
                    data={datosCurvas}
                  />

                  <MarkSeries
                    data={[
                      { x: 0, y: 0 },
                      {
                        x: parseInt(getValues("b")),
                        y: parseInt(getValues("b")),
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

const formula = (x) => {
  return Math.pow(x, 3) / (1 + Math.pow(x, 0.5));
};
