import Head from "next/head";
import Image from "next/image";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";

import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Metodos numericos</title>
        <meta name="description" content="Interpolacion metodos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container fluid="xl" className="pt-3">
        <h1>Métodos Numéricos</h1>
        <div className="mt-3">
          <p>
            Los métodos numéricos son una sucesión de operaciones matemáticas
            utilizadas para encontrar una solución numérica aproximada a un
            problema determinado. Es decir, se trata de una serie de cálculos
            para acercarnos lo más posible a una solución numérica con una
            precisión razonablemente buena. Los métodos numéricos son utilizados
            en ingeniería para facilitar la resolución de problemas que
            conllevan una enorme cantidad de cálculos, lo que permite ahorrar
            tiempo.
          </p>
          <div className="d-flex row justify-content-md-center ">
            <Row className="d-flex row justify-content-md-center ">
              <Col>
                <Image
                  src={require("../images/Trapezoidal_rule_illustration.png")}
                  alt="formula de trapezoide"
                  style={{
                    objectFit: "cover",
                    height: 350,
                    width: 350,
                  }}
                />
              </Col>
              <Col>
                <Image
                  src={require("../images/polinomial.jpg")}
                  alt="formula de trapezoide"
                  style={{
                    objectFit: "cover",
                    height: 350,
                    width: 350,
                  }}
                />
              </Col>
              <Col>
                <Image
                  src={require("../images/Simpson-01.jpg")}
                  alt="formula de trapezoide"
                  style={{
                    objectFit: "cover",
                    height: 350,
                    width: 350,
                  }}
                />
              </Col>
            </Row>
          </div>
          <div className="mt-4">
            <h5>Definición de método numérico</h5>
            <Alert variant="info">
              {`"Un método numérico es una serie de pasos (procedimiento) que se
              plantean para obtener una solución aproximada de un problema. Para
              lograr este objetivo, se utilizan cálculos puramente aritméticos y
              lógicos."`}
            </Alert>
            <p>
              Por lo general, los métodos numéricos se utilizan en ordenadores,
              dispositivos electrónicos o software especializados en ingeniería,
              los cuales, ya tienen incluidos los métodos numéricos en sus
              algoritmos de resolución, siendo vitales en el área de simulación
              de procesos y para dar respuestas rápidas donde una solución
              analítica se vuelve compleja. En este artículo definiremos los
              métodos numéricos, el análisis numérico y los usos del análisis
              numérico.
            </p>
          </div>
          <div className="mt-3">
            <h5>¿Por qué se utilizan los métodos numéricos?</h5>
            <p>
              Anteriormente comentábamos que los métodos numéricos son
              algoritmos utilizados para resolver operaciones matemáticas
              complejas mediante el uso de un programa informático, siendo
              varias las razones para utilizar métodos numéricos en vez de
              métodos de resolución analíticos, sin embargo, las podemos resumir
              en dos razones fundamentales:
            </p>
            <ul>
              <li>
                Resolver problemas muy complejos, en los cuales no se puede
                hallar una solución analítica.
              </li>
              <li>
                Resolver problemas con gran cantidad de cálculos, que harían
                casi imposible su resolución manual.
              </li>
            </ul>
          </div>

          <div className="mt-3 mb-5">
            <h5>Probar métodos</h5>
            <Row>
              <Col>
                <Button>Regla Trapezoidal</Button>
              </Col>
              <Col>
                <Button variant="danger">Regla de Simpson</Button>
              </Col>
              <Col>
                <Button variant="success">Mínimo cuadrado</Button>
              </Col>
              <Col>
                <Button variant="info" className="text-white">
                  Regresión polinomial
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
