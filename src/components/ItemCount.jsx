import { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";

function ItemCount({ stock, initial, onAdd }) {
  const [count, setCount] = useState(initial);

  const handleIncrement = () => {
    if (count < stock) {
      setCount(count + 1);
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleAdd = () => {
    if (count > 0 && count <= stock) {
      onAdd(count);
      setCount(initial);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <ButtonGroup>
          <Button
            variant="outline-secondary"
            onClick={handleDecrement}
            disabled={count <= 1}
          >
            -
          </Button>
          <Form.Control
            type="text"
            value={count}
            readOnly
            className="text-center"
            style={{ maxWidth: "60px" }}
          />
          <Button
            variant="outline-secondary"
            onClick={handleIncrement}
            disabled={count >= stock}
          >
            +
          </Button>
        </ButtonGroup>

        <span className="text-muted">
          Stock disponible: <strong>{stock}</strong>
        </span>
      </div>

      <Button
        variant="primary"
        className="w-100"
        onClick={handleAdd}
        disabled={stock === 0}
      >
        {stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
      </Button>
    </div>
  );
}

export default ItemCount;