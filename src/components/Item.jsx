import { Link } from "react-router-dom";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Col from "react-bootstrap/Col";
import Placeholder from "react-bootstrap/Placeholder";

function Item({ product }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const minPrice = Math.min(...product.spaces.map((s) => s.price));
  const priceWithService = (minPrice * 1.1).toFixed(0);

  return (
    <Col xs={12} sm={6} md={4} lg={3}>
      <Card className="h-100 shadow-sm product-card">
        <div className="position-relative">
          {/* Placeholder mientras carga */}
          {!imageLoaded && !imageError && (
            <div 
              style={{ 
                height: "200px", 
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}

          {/* Imagen con lazy loading */}
          {!imageError ? (
            <Card.Img
              variant="top"
              src={product.images[0]}
              alt={product.title}
              loading="lazy"
              style={{ 
                height: "200px", 
                objectFit: "cover",
                display: imageLoaded ? "block" : "none"
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
          ) : (
            // Imagen de fallback si falla la carga
            <div 
              style={{ 
                height: "200px", 
                backgroundColor: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999"
              }}
            >
              <i className="fas fa-image" style={{ fontSize: "3rem" }}></i>
            </div>
          )}

          <Badge
            bg="danger"
            className="position-absolute top-0 end-0 m-2"
          >
            {product.type === "show" ? "Show" : "Producto"}
          </Badge>
        </div>

        <Card.Body className="d-flex flex-column">
          <Card.Title className="h6">{product.title}</Card.Title>
          <Card.Text className="text-muted small mb-1">
            📅 {new Date(product.date).toLocaleDateString("es-AR")}
          </Card.Text>
          <Card.Text className="text-muted small mb-3">
            📍 {product.venue}
          </Card.Text>

          <div className="mt-auto">
            <p className="fw-bold text-success mb-2">
              Desde ${priceWithService.toLocaleString()}
              <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                (inc. service charge)
              </small>
            </p>

            <Link to={`/item/${product.id}`}>
              <Button variant="primary" className="w-100">
                Ver Detalles
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Item;