import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import { getProducts, deleteProduct } from "../services/productsService";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      
      setDeleteMessage(`"${productToDelete.title}" fue eliminado exitosamente.`);
      setShowConfirmModal(false);
      setProductToDelete(null);
      
      // Recargar productos
      await loadProducts();
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setDeleteMessage("");
      }, 3000);
      
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      alert("Error al eliminar el producto. Por favor intenta de nuevo.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setProductToDelete(null);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando productos...</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestionar Shows</h2>
          <Link to="/admin">
            <Button variant="success">
              <i className="fas fa-plus me-2"></i>
              Crear Nuevo Show
            </Button>
          </Link>
        </div>

        {deleteMessage && (
          <Alert variant="success" dismissible onClose={() => setDeleteMessage("")}>
            <i className="fas fa-check-circle me-2"></i>
            {deleteMessage}
          </Alert>
        )}

        <Card className="shadow">
          <Card.Body>
            {products.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-box-open mb-3" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                <p className="text-muted mb-4">No hay shows creados aún</p>
                <Link to="/admin">
                  <Button variant="primary">Crear mi primer show</Button>
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover>
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "60px" }}>#</th>
                      <th>Imagen</th>
                      <th>Título</th>
                      <th>Artista</th>
                      <th>Fecha</th>
                      <th>Lugar</th>
                      <th>Categoría</th>
                      <th style={{ width: "150px" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id}>
                        <td>{index + 1}</td>
                        <td>
                          {product.images && product.images[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              style={{ 
                                width: "50px", 
                                height: "50px", 
                                objectFit: "cover",
                                borderRadius: "4px"
                              }}
                            />
                          ) : (
                            <div 
                              style={{ 
                                width: "50px", 
                                height: "50px", 
                                backgroundColor: "#ddd",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <i className="fas fa-image text-muted"></i>
                            </div>
                          )}
                        </td>
                        <td>
                          <strong>{product.title}</strong>
                        </td>
                        <td>{product.artist}</td>
                        <td>
                          {new Date(product.date).toLocaleDateString("es-AR")}
                        </td>
                        <td>{product.venue}</td>
                        <td>
                          <Badge bg="info">{product.category}</Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link to={`/item/${product.id}`}>
                              <Button variant="outline-primary" size="sm" title="Ver detalles">
                                <i className="fas fa-eye"></i>
                              </Button>
                            </Link>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteClick(product)}
                              title="Eliminar"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {products.length > 0 && (
          <div className="mt-4">
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-3">
                  <i className="fas fa-chart-bar me-2"></i>
                  Estadísticas
                </h5>
                <Row>
                  <Col md={6}>
                    <p className="mb-2">
                      <strong>Total de shows:</strong> {products.length}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-0">
                      <strong>Categorías únicas:</strong>{" "}
                      {new Set(products.map((p) => p.category)).size}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal show={showConfirmModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productToDelete && (
            <>
              <p>¿Estás seguro de que deseas eliminar este show?</p>
              <Alert variant="warning" className="mb-0">
                <strong>{productToDelete.title}</strong>
                <br />
                <small>Esta acción no se puede deshacer.</small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCancelDelete}
            disabled={deleting}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  className="me-2"
                />
                Eliminando...
              </>
            ) : (
              <>
                <i className="fas fa-trash me-2"></i>
                Eliminar
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ManageProducts;
