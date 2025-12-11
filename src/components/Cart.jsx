import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { createOrder } from "../services/ordersService";
import PaymentForm from "./PaymentForm";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import ButtonGroup from "react-bootstrap/ButtonGroup";
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
  const [orderDate, setOrderDate] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [buyer, setBuyer] = useState({
    name: "",
    phone: "",
    email: "",
    emailConfirm: ""
  });

  const handleCheckout = async (paymentData) => {
    setLoading(true);

    try {
      // Crear orden con datos de pago
      const orderData = {
        paymentMethod: paymentData.method,
        ...(paymentData.card && { cardInfo: paymentData.card })
      };

      const id = await createOrder(orderData, buyer, cart);
      
      setOrderId(id);
      setOrderDate(new Date().toLocaleString('es-AR'));
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

  // PANTALLA DE CONFIRMACIÓN
  if (orderSuccess) {
    return (
      <Container className="py-5">
        <Card className="shadow">
          <Card.Body className="text-center py-5">
            <div className="mb-4">
              <div 
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "#28a745",
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <i className="fas fa-check text-white" style={{ fontSize: "3rem" }}></i>
              </div>
            </div>

            <h2 className="mb-3">¡Compra realizada con éxito!</h2>
            
            <Card className="mx-auto mb-4" style={{ maxWidth: "500px" }}>
              <Card.Body>
                <Row className="text-start">
                  <Col xs={5} className="text-muted">Número de orden:</Col>
                  <Col xs={7}><strong>{orderId}</strong></Col>
                  
                  <Col xs={5} className="text-muted mt-2">Fecha:</Col>
                  <Col xs={7} className="mt-2">{orderDate}</Col>
                  
                  <Col xs={5} className="text-muted mt-2">Email:</Col>
                  <Col xs={7} className="mt-2">{buyer.email}</Col>
                  
                  <Col xs={5} className="text-muted mt-2">Total:</Col>
                  <Col xs={7} className="mt-2">
                    <strong className="text-success">
                      ${getTotalPrice().toLocaleString()}
                    </strong>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Alert variant="info" className="mx-auto" style={{ maxWidth: "600px" }}>
              <i className="fas fa-envelope me-2"></i>
              Recibirás un email de confirmación con todos los detalles de tu compra
              y las entradas en <strong>{buyer.email}</strong>
            </Alert>

            <div className="d-flex gap-3 justify-content-center mt-4">
              <Link to="/">
                <Button variant="primary" size="lg">
                  <i className="fas fa-home me-2"></i>
                  Volver al Inicio
                </Button>
              </Link>
              <Button 
                variant="outline-secondary" 
                size="lg"
                onClick={() => window.print()}
              >
                <i className="fas fa-print me-2"></i>
                Imprimir Comprobante
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // CARRITO VACÍO
  if (cart.length === 0) {
    return (
      <Container className="py-5">
        <Card className="shadow text-center py-5">
          <Card.Body>
            <div className="mb-4">
              <i 
                className="fas fa-shopping-cart text-muted" 
                style={{ fontSize: "5rem" }}
              ></i>
            </div>
            <h2 className="mb-4">Tu carrito está vacío</h2>
            <p className="text-muted mb-4">
              ¡Agrega algunos shows increíbles a tu carrito!
            </p>
            <Link to="/">
              <Button variant="primary" size="lg">
                <i className="fas fa-ticket-alt me-2"></i>
                Ver Shows Disponibles
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // CARRITO CON PRODUCTOS
  return (
    <>
      <Container className="py-5">
        <Row>
          {/* COLUMNA IZQUIERDA - PRODUCTOS */}
          <Col lg={8}>
            <Card className="shadow mb-4">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">
                  <i className="fas fa-shopping-cart me-2"></i>
                  Carrito de Compras
                  <Badge bg="light" text="dark" className="ms-3">
                    {getTotalItems()} items
                  </Badge>
                </h4>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "45%" }}>Producto</th>
                        <th style={{ width: "15%" }}>Tipo</th>
                        <th style={{ width: "12%" }}>Precio</th>
                        <th style={{ width: "15%" }}>Cantidad</th>
                        <th style={{ width: "10%" }}>Subtotal</th>
                        <th style={{ width: "3%" }}></th>
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
                                <strong className="d-block">{item.title}</strong>
                                <small className="text-muted d-block">
                                  {item.artist}
                                </small>
                                {item.date && (
                                  <small className="text-muted d-block">
                                    📅 {new Date(item.date).toLocaleDateString("es-AR")}
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="align-middle">
                            <Badge 
                              bg={item.type === "ticket" ? "info" : "success"}
                            >
                              {item.spaceType}
                            </Badge>
                          </td>
                          <td className="align-middle fw-bold text-success">
                            ${item.price.toLocaleString()}
                          </td>
                          <td className="align-middle">
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
                                <i className="fas fa-minus"></i>
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
                                <i className="fas fa-plus"></i>
                              </Button>
                            </ButtonGroup>
                          </td>
                          <td className="align-middle fw-bold">
                            ${(item.price * item.quantity).toLocaleString()}
                          </td>
                          <td className="align-middle">
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
                </div>
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

          {/* COLUMNA DERECHA - RESUMEN */}
          <Col lg={4}>
            <Card className="shadow mb-4 sticky-top" style={{ top: "100px" }}>
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">
                  <i className="fas fa-receipt me-2"></i>
                  Resumen de Compra
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({getTotalItems()} items):</span>
                  <strong>${getTotalPrice().toLocaleString()}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Service Charge:</span>
                  <span className="text-muted">Incluido</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío de entradas:</span>
                  <span className="text-success">GRATIS</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong style={{ fontSize: "1.1rem" }}>Total:</strong>
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
                  <i className="fas fa-lock me-2"></i>
                  Proceder al Pago
                </Button>

                <Link to="/">
                  <Button variant="outline-primary" className="w-100">
                    <i className="fas fa-arrow-left me-2"></i>
                    Seguir Comprando
                  </Button>
                </Link>
              </Card.Body>
            </Card>

            <Alert variant="info" className="shadow-sm">
              <Alert.Heading className="h6">
                <i className="fas fa-shield-alt me-2"></i>
                Compra Segura
              </Alert.Heading>
              <small>
                • Pagos protegidos con SSL<br />
                • Entradas enviadas por email<br />
                • Garantía de devolución<br />
                • Soporte 24/7
              </small>
            </Alert>

            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <p className="mb-2 small text-muted">Aceptamos</p>
                <div className="d-flex justify-content-center gap-2">
                  <Badge bg="light" text="dark">💳 Visa</Badge>
                  <Badge bg="light" text="dark">💳 Mastercard</Badge>
                  <Badge bg="light" text="dark">💳 Amex</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* MODAL DE CHECKOUT CON FORMULARIO DE PAGO */}
      <Modal 
        show={showCheckout} 
        onHide={() => !loading && setShowCheckout(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton={!loading}>
          <Modal.Title>
            <i className="fas fa-credit-card me-2"></i>
            Completar Pago
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Procesando tu pago...</p>
              <p className="text-muted">Por favor espera</p>
            </div>
          ) : (
            <PaymentForm
              totalAmount={getTotalPrice()}
              onSubmit={handleCheckout}
              buyer={buyer}
              setBuyer={setBuyer}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Cart;