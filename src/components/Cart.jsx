import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { createOrder } from "../services/ordersService";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

function Cart() {
  const { 
    cart, 
    removeItem, 
    clear, 
    getTotalPrice, 
    getTotalItems,
    updateQuantity 
  } = useContext(CartContext);

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [buyer, setBuyer] = useState({
    name: "",
    phone: "",
    email: "",
    emailConfirm: ""
  });

  const handleInputChange = (e) => {
    setBuyer({
      ...buyer,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    // Validar que los emails coincidan
    if (buyer.email !== buyer.emailConfirm) {
      alert("Los emails no coinciden");
      return;
    }

    setLoading(true);

    try {
      const id = await createOrder({}, buyer, cart);
      
      setOrderId(id);
      setOrderSuccess(true);
      setShowCheckout(false);
      clear(); // Vaciar carrito después de compra exitosa
      
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      alert("Hubo un error al procesar tu compra. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <Container className="py-5">
        <Card className="shadow text-center py-5">
          <Card.Body>
            <div className="mb-4">
              <i className="fas fa-check-circle text-success" style={{ fontSize: "5rem" }}></i>
            </div>
            <h2 className="mb-3">¡Compra realizada con éxito!</h2>
            <p className="lead mb-4">
              Tu número de orden es: <strong>{orderId}</strong>
            </p>
            <Alert variant="info">
              Recibirás un email de confirmación con los detalles de tu compra
              en <strong>{buyer.email}</strong>
            </Alert>
            <Link to="/">
              <Button variant="primary" size="lg" className="mt-3">
                Volver al Inicio
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (cart.length === 0) {
    return (
      <Container className="py-5">
        <Card className="shadow text-center py-5">
          <Card.Body>
            <h2 className="mb-4">Tu carrito está vacío</h2>
            <p className="text-muted mb-4">
              ¡Agrega algunos shows increíbles a tu carrito!
            </p>
            <Link to="/">
              <Button variant="primary" size="lg">
                Ver Shows Disponibles
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <Container className="py-5">
        <Row>
          <Col lg={8}>
            <Card className="shadow mb-4">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">
                  Carrito de Compras
                  <Badge bg="light" text="dark" className="ms-3">
                    {getTotalItems()} items
                  </Badge>
                </h4>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Producto</th>
                      <th>Tipo</th>
                      <th>Precio Unit.</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={`${item.id}-${item.spaceType}`}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.image}
                              alt={item.title}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                              className="me-3"
                            />
                            <div>
                              <strong>{item.title}</strong>
                              <br />
                              <small className="text-muted">
                                {item.artist}
                              </small>
                              {item.date && (
                                <>
                                  <br />
                                  <small className="text-muted">
                                    📅 {new Date(item.date).toLocaleDateString("es-AR")}
                                  </small>
                                </>
                              )}
                              {item.venue && (
                                <>
                                  <br />
                                  <small className="text-muted">
                                    📍 {item.venue}
                                  </small>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge 
                            bg={item.type === "ticket" ? "info" : "success"}
                          >
                            {item.spaceType}
                          </Badge>
                        </td>
                        <td className="fw-bold text-success">
                          ${item.price.toLocaleString()}
                        </td>
                        <td>
                          <ButtonGroup size="sm">
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.spaceType,
                                  item.quantity - 1
                                )
                              }
                            >
                              -
                            </Button>
                            <Button variant="outline-secondary" disabled>
                              {item.quantity}
                            </Button>
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.spaceType,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </Button>
                          </ButtonGroup>
                        </td>
                        <td className="fw-bold">
                          ${(item.price * item.quantity).toLocaleString()}
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeItem(item.id, item.spaceType)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
              <Card.Footer className="bg-light">
                <Button
                  variant="outline-danger"
                  onClick={clear}
                  disabled={cart.length === 0}
                >
                  <i className="fas fa-trash-alt me-2"></i>
                  Vaciar Carrito
                </Button>
              </Card.Footer>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow mb-4">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">Resumen de Compra</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <strong>${getTotalPrice().toLocaleString()}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Service Charge:</span>
                  <span className="text-muted">Incluido</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <h4 className="text-success mb-0">
                    ${getTotalPrice().toLocaleString()}
                  </h4>
                </div>

                <Button 
                  variant="success" 
                  className="w-100 mb-3" 
                  size="lg"
                  onClick={() => setShowCheckout(true)}
                >
                  Finalizar Compra
                </Button>

                <Link to="/">
                  <Button variant="outline-primary" className="w-100">
                    Seguir Comprando
                  </Button>
                </Link>
              </Card.Body>
            </Card>

            <Alert variant="info">
              <Alert.Heading className="h6">
                <i className="fas fa-info-circle me-2"></i>
                Información
              </Alert.Heading>
              <small>
                • Los precios incluyen service charge
                <br />
                • Las entradas se enviarán por email
                <br />• Compra segura y protegida
              </small>
            </Alert>
          </Col>
        </Row>
      </Container>

      {/* MODAL DE CHECKOUT */}
      <Modal show={showCheckout} onHide={() => setShowCheckout(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Completar Compra</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCheckout}>
          <Modal.Body>
            <h5 className="mb-3">Datos del Comprador</h5>
            
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={buyer.name}
                onChange={handleInputChange}
                placeholder="Juan Pérez"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={buyer.phone}
                onChange={handleInputChange}
                placeholder="+54 11 1234-5678"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={buyer.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar Email</Form.Label>
              <Form.Control
                type="email"
                name="emailConfirm"
                value={buyer.emailConfirm}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
              />
            </Form.Group>

            <hr />

            <h5 className="mb-3">Resumen de la Orden</h5>
            <p><strong>Total de items:</strong> {getTotalItems()}</p>
            <p><strong>Total a pagar:</strong> ${getTotalPrice().toLocaleString()}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCheckout(false)}>
              Cancelar
            </Button>
            <Button 
              variant="success" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Procesando...
                </>
              ) : (
                "Confirmar Compra"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Cart;