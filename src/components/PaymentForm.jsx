// src/components/PaymentForm.jsx
// Formulario de pago completo con validaciones

import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

function PaymentForm({ totalAmount, onSubmit, buyer, setBuyer }) {
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});

  // Formatear número de tarjeta (grupos de 4)
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Máx 16 dígitos + 3 espacios
  };

  // Formatear fecha de expiración (MM/YY)
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  // Validar tarjeta de crédito (Algoritmo de Luhn)
  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.length !== 16) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  // Detectar tipo de tarjeta
  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return { name: 'Visa', icon: '💳' };
    if (/^5[1-5]/.test(cleaned)) return { name: 'Mastercard', icon: '💳' };
    if (/^3[47]/.test(cleaned)) return { name: 'Amex', icon: '💳' };
    return { name: '', icon: '💳' };
  };

  // Validar fecha de expiración
  const validateExpiry = (expiry) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  // Manejar cambios en los inputs
  const handleCardChange = (field, value) => {
    let formatted = value;

    if (field === 'number') {
      formatted = formatCardNumber(value);
    } else if (field === 'expiry') {
      formatted = formatExpiry(value);
    } else if (field === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'name') {
      formatted = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    }

    setCardData({
      ...cardData,
      [field]: formatted
    });

    // Limpiar error del campo
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Validar formulario completo
  const validateForm = () => {
    const newErrors = {};

    // Validar datos del comprador
    if (!buyer.name.trim()) newErrors.buyerName = 'Nombre requerido';
    if (!buyer.phone.trim()) newErrors.buyerPhone = 'Teléfono requerido';
    if (!buyer.email.trim()) newErrors.buyerEmail = 'Email requerido';
    if (buyer.email !== buyer.emailConfirm) {
      newErrors.buyerEmailConfirm = 'Los emails no coinciden';
    }

    // Validar método de pago
    if (paymentMethod === 'tarjeta') {
      if (!validateCardNumber(cardData.number)) {
        newErrors.cardNumber = 'Número de tarjeta inválido';
      }
      if (!cardData.name.trim()) {
        newErrors.cardName = 'Nombre del titular requerido';
      }
      if (!validateExpiry(cardData.expiry)) {
        newErrors.cardExpiry = 'Fecha de expiración inválida';
      }
      if (cardData.cvv.length < 3) {
        newErrors.cardCvv = 'CVV debe tener 3-4 dígitos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Preparar datos de pago
    const paymentData = {
      method: paymentMethod,
      ...(paymentMethod === 'tarjeta' && {
        card: {
          lastFourDigits: cardData.number.slice(-4),
          type: getCardType(cardData.number).name,
          holder: cardData.name
        }
      })
    };

    onSubmit(paymentData);
  };

  const cardType = getCardType(cardData.number);

  return (
    <Form onSubmit={handleSubmit}>
      {/* DATOS DEL COMPRADOR */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h6 className="mb-0">👤 Datos del Comprador</h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Completo *</Form.Label>
                <Form.Control
                  type="text"
                  value={buyer.name}
                  onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
                  isInvalid={!!errors.buyerName}
                  placeholder="Juan Pérez"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.buyerName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono *</Form.Label>
                <Form.Control
                  type="tel"
                  value={buyer.phone}
                  onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                  isInvalid={!!errors.buyerPhone}
                  placeholder="+54 11 1234-5678"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.buyerPhone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={buyer.email}
                  onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
                  isInvalid={!!errors.buyerEmail}
                  placeholder="tu@email.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.buyerEmail}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Confirmar Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={buyer.emailConfirm}
                  onChange={(e) => setBuyer({ ...buyer, emailConfirm: e.target.value })}
                  isInvalid={!!errors.buyerEmailConfirm}
                  placeholder="tu@email.com"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.buyerEmailConfirm}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* MÉTODO DE PAGO */}
      <Card className="mb-4">
        <Card.Header className="bg-success text-white">
          <h6 className="mb-0">💳 Método de Pago</h6>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                id="payment-card"
                label="💳 Tarjeta de Crédito/Débito"
                checked={paymentMethod === 'tarjeta'}
                onChange={() => setPaymentMethod('tarjeta')}
              />
              <Form.Check
                type="radio"
                id="payment-transfer"
                label="🏦 Transferencia Bancaria"
                checked={paymentMethod === 'transferencia'}
                onChange={() => setPaymentMethod('transferencia')}
              />
              <Form.Check
                type="radio"
                id="payment-cash"
                label="💵 Efectivo"
                checked={paymentMethod === 'efectivo'}
                onChange={() => setPaymentMethod('efectivo')}
              />
            </div>
          </Form.Group>

          {/* FORMULARIO DE TARJETA */}
          {paymentMethod === 'tarjeta' && (
            <>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Número de Tarjeta *</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        value={cardData.number}
                        onChange={(e) => handleCardChange('number', e.target.value)}
                        isInvalid={!!errors.cardNumber}
                        isValid={cardData.number && validateCardNumber(cardData.number)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {cardType.name && (
                        <Badge 
                          bg="light" 
                          text="dark"
                          className="position-absolute top-50 end-0 translate-middle-y me-2"
                        >
                          {cardType.icon} {cardType.name}
                        </Badge>
                      )}
                      <Form.Control.Feedback type="invalid">
                        {errors.cardNumber}
                      </Form.Control.Feedback>
                    </div>
                    <Form.Text className="text-muted">
                      Aceptamos Visa, Mastercard y American Express
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre del Titular *</Form.Label>
                    <Form.Control
                      type="text"
                      value={cardData.name}
                      onChange={(e) => handleCardChange('name', e.target.value)}
                      isInvalid={!!errors.cardName}
                      placeholder="JUAN PEREZ"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cardName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Vencimiento *</Form.Label>
                    <Form.Control
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => handleCardChange('expiry', e.target.value)}
                      isInvalid={!!errors.cardExpiry}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cardExpiry}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>CVV *</Form.Label>
                    <Form.Control
                      type="text"
                      value={cardData.cvv}
                      onChange={(e) => handleCardChange('cvv', e.target.value)}
                      isInvalid={!!errors.cardCvv}
                      placeholder="123"
                      maxLength={4}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cardCvv}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Alert variant="info" className="mb-0">
                <small>
                  <i className="fas fa-lock me-2"></i>
                  Tus datos están protegidos con encriptación SSL
                </small>
              </Alert>
            </>
          )}

          {/* TRANSFERENCIA BANCARIA */}
          {paymentMethod === 'transferencia' && (
            <Alert variant="info">
              <Alert.Heading className="h6">Datos para Transferencia</Alert.Heading>
              <p className="mb-1"><strong>Banco:</strong> Banco Nación</p>
              <p className="mb-1"><strong>Titular:</strong> Las Puertas del Olimpo S.A.</p>
              <p className="mb-1"><strong>CUIT:</strong> 30-12345678-9</p>
              <p className="mb-1"><strong>CBU:</strong> 0110000000000000000000</p>
              <p className="mb-0"><strong>Alias:</strong> OLIMPO.TICKETS</p>
            </Alert>
          )}

          {/* EFECTIVO */}
          {paymentMethod === 'efectivo' && (
            <Alert variant="warning">
              <Alert.Heading className="h6">Pago en Efectivo</Alert.Heading>
              <p className="mb-0">
                Deberás abonar en nuestras oficinas o en el lugar del evento.
                Recibirás un código de pago por email.
              </p>
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* RESUMEN Y BOTÓN */}
      <Card className="bg-light">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="h5 mb-0">Total a Pagar:</span>
            <span className="h4 text-success mb-0">
              ${totalAmount.toLocaleString()}
            </span>
          </div>

          <Button 
            variant="success" 
            type="submit" 
            size="lg" 
            className="w-100"
          >
            <i className="fas fa-check-circle me-2"></i>
            Confirmar y Pagar
          </Button>

          <div className="text-center mt-3">
            <small className="text-muted">
              Al confirmar aceptas nuestros términos y condiciones
            </small>
          </div>
        </Card.Body>
      </Card>
    </Form>
  );
}

export default PaymentForm;