import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail";
import { getProductById } from "../services/productsService";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

function ItemDetailContainer() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { itemId } = useParams();

  useEffect(() => {
    setLoading(true);

    const fetchProduct = async () => {
      try {
        const data = await getProductById(itemId);
        setProduct(data);
      } catch (error) {
        console.error("Error al cargar producto:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [itemId]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando producto...</p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Producto no encontrado</Alert.Heading>
          <p>El producto que buscas no existe o fue eliminado.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <ItemDetail product={product} />
    </Container>
  );
}

export default ItemDetailContainer;