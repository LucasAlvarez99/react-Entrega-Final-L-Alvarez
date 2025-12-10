import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function CartWidget() {
  const { getTotalItems } = useContext(CartContext);
  const totalItems = getTotalItems();

  return (
    <Link to="/cart" className="text-decoration-none">
      <div className="cart-widget">
        🛒 
        {totalItems > 0 && (
          <span className="cart-count">{totalItems}</span>
        )}
      </div>
    </Link>
  );
}

export default CartWidget;
