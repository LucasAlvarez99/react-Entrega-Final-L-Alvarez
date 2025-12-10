import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { getProducts, deleteProduct } from "../services/productsService";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState("");

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

  const handleDelete = async (id, title) => {
    if (window.confirm(`¿Estás seguro de eliminar "${title}"?`)) {
      try {
        await deleteProduct(id);
        setDeleteMessage(`"${title}" fue eliminado exitosamente.`);
        loadProducts();
        
        setTimeout(() => {
          setDeleteMessage("");
        }, 3000);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("Error al eliminar el producto");
      }
    }
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
          {deleteMessage}
        </Alert>
      )}

      <Card className="shadow">
        <Card.Body>
          {products.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-4">No hay shows creados aún</p>
              <Link to="/admin">
                <Button variant="primary">Crear mi primer show</Button>
              </Link>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Título</th>
                  <th>Artista</th>
                  <th>Fecha</th>
                  <th>Lugar</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
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
                          <Button variant="outline-primary" size="sm">
                            <i className="fas fa-eye"></i>
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(product.id, product.title)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <div className="mt-4">
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Estadísticas</h5>
            <p className="mb-1">
              <strong>Total de shows:</strong> {products.length}
            </p>
            <p className="mb-0">
              <strong>Categorías únicas:</strong>{" "}
              {new Set(products.map((p) => p.category)).size}
            </p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default ManageProducts;