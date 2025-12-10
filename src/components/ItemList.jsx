import Item from "./Item";
import Row from "react-bootstrap/Row";

function ItemList({ products }) {
  return (
    <Row className="g-4">
      {products.length === 0 ? (
        <div className="col-12 text-center py-5">
          <p className="text-muted">No se encontraron productos en esta categoría</p>
        </div>
      ) : (
        products.map((product) => <Item key={product.id} product={product} />)
      )}
    </Row>
  );
}

export default ItemList;