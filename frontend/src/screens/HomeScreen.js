import React, { useEffect } from 'react';
// import axios from 'axios';
import Product from '../components/Product';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../actions/productActions';

const HomeScreen = () => {
    // const [products, setProducts] = useState([]); // use hook to manage the state of ur react component, the defult value is empty array
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(false);
    const dispatch = useDispatch();
    const productList = useSelector( state => state.productList);
    const { loading, error, products} = productList;
    useEffect(()=>{
        // const fetchData = async () => {
        //     try{
        //         setLoading(true);
        //         const {data} = await axios.get('/api/products');
        //         setLoading(false);
        //         setProducts(data);
        //     } catch(err){
        //         setError(err.message);
        //         setLoading(false);
        //     }
        // };
        // fetchData();
        dispatch(listProducts())
    }, [dispatch])
    return (
        <div>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <div className="row center">
                {
                    products.map((product) => (
                    <Product key={product._id} product={product}></Product>
                    ))
                }
                </div>
            )}
        </div>
    );
};

export default HomeScreen;