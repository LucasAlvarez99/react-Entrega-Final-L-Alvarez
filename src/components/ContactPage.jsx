import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    setSubmitted(true);

    // Resetear formulario después de 3 segundos
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Contacto</h2>
              <p className="text-center text-muted mb-4">
                ¿Tienes alguna pregunta? ¡Escríbenos y te responderemos pronto!
              </p>

              {submitted && (
                <Alert variant="success" className="mb-4">
                  <Alert.Heading>¡Mensaje enviado!</Alert.Heading>
                  <p>
                    Gracias por contactarnos. Te responderemos a la brevedad.
                  </p>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Asunto</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Asunto del mensaje"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Enviar Mensaje
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* INFORMACIÓN DE CONTACTO */}
          <Card className="shadow mt-4">
            <Card.Body>
              <h5 className="mb-3">Información de Contacto</h5>
              <p className="mb-2">
                <strong>📧 Email:</strong> info@laspuertasdelolimpo.com
              </p>
              <p className="mb-2">
                <strong>📞 Teléfono:</strong> +54 11 1234-5678
              </p>
              <p className="mb-0">
                <strong>📍 Dirección:</strong> Buenos Aires, Argentina
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactPage;