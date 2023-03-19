import { useEffect, useState } from 'react';
import { Link,useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function HomeScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/item/list');
      setProducts(result.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isFromSignup = location.state?.signedUp;
    
    if (!token&& !isFromSignup) {
      navigate("/");
    }
  }, [navigate,location.state]);

  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products">
        {products.map((product) => (
          <div className="product" key={product.slug}>
            <Link to={`/product/${product.name.trim().toLowerCase().replaceAll("\\s", "-")}`}>
              <img src={product.url} alt={product.name} />
            </Link>
            <div className="product-info">
              <Link to={`/product/${product.name.trim().toLowerCase().replaceAll("\\s", "-")}`}>
                <p>{product.name}</p>
              </Link>
              <p>
                <strong>₹{product.price}</strong>
              </p>
              <button>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default HomeScreen;