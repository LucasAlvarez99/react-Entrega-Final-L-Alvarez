import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ItemList from "./ItemList";
import { getProducts, getProductsByCategory } from "../services/productsService";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function ItemListContainer({ greeting }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    const fetchProducts = async () => {
      try {
        let data;
        if (categoryId) {
          data = await getProductsByCategory(categoryId);
        } else {
          data = await getProducts();
        }
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando productos...</p>
      </Container>
    );
  }

  // Si no hay productos en absoluto (base de datos vacía)
  if (!loading && products.length === 0 && !categoryId) {
    return (
      <Container className="py-5">
        <Card className="shadow text-center py-5">
          <Card.Body>
            <div className="mb-4">
              <i className="fas fa-box-open" style={{ fontSize: "5rem", color: "#ccc" }}></i>
            </div>
            <h2 className="mb-3">No hay shows disponibles</h2>
            <p className="text-muted mb-4">
              Aún no se han cargado shows en la base de datos.
            </p>
            <Link to="/admin">
              <Button variant="primary" size="lg">
                Ir al Panel Admin para Crear Shows
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {greeting && (
        <div className="text-center mb-4">
          <h2 className="display-5 fw-bold">{greeting}</h2>
          <p className="lead text-muted">
            ¡Elige a que purgatorio irás en las próximas fechas!
          </p>
        </div>
      )}

      {categoryId && (
        <h3 className="mb-4 text-capitalize">
          Categoría: {categoryId.replace("-", " ")}
        </h3>
      )}

      <ItemList products={products} />
    </Container>
  );
}

export default ItemListContainer;