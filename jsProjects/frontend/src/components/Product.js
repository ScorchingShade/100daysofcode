import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function Product({ product }) {
  return (
    <Card>
      <Link
        to={`/product/${product.name
          .trim()
          .toLowerCase()
          .replaceAll("\\s", "-")}`}
      >
        <img src={product.url} alt={product.name} className="card-img-top card-image-fit" />
      </Link>
      <Card.Body>
        <Link
          to={`/product/${product.name
            .trim()
            .toLowerCase()
            .replaceAll("\\s", "-")}`}
        >
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Card.Text>₹{product.price}</Card.Text>
        <Button>Add to cart</Button>
      </Card.Body>
    </Card>
  );
}

export default Product;
