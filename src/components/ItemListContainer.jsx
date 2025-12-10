
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemList from "./ItemList";
import { getProducts, getProductsByCategory } from "../services/productsService";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

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

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando productos...</p>
        </div>
      ) : (
        <ItemList products={products} />
      )}
    </Container>
  );
}

export default ItemListContainer;

