import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts, createProduct, deleteProduct } from '../actions/productActions';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import { PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET } from '../constants/productConstants';

const ProductListScreen = (props) => {
    //打开page，会loading两遍，第一遍productlist是空的，之后那一遍才有值
    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;
    const productCreate = useSelector((state) => state.productCreate);
    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        product: createdProduct
    } = productCreate;
    const dispatch = useDispatch();
    const productDelete = useSelector(state => state.productDelete);
    const {
        loading: deleteLoading,
        error: deleteError,
        success: deleteSuccess,
    } = productDelete;
    useEffect(() => {
        if(successCreate){
            dispatch({type: PRODUCT_CREATE_RESET});
            props.history.push(`/product/${createdProduct._id}/edit`)
        }
        if(deleteSuccess){
            dispatch({type: PRODUCT_DELETE_RESET});
        }
      dispatch(listProducts());
    }, [createdProduct, deleteSuccess, dispatch, props.history, successCreate]);
    
    const deleteHandler = (product) => {
        if(window.confirm('Are you sure to delete?')){
            dispatch(deleteProduct(product._id))
        }
    };
    const createHandler = () => {
        dispatch(createProduct());
    }
    return (
        <div>
            <div className="row">
                <h1>Products</h1>
                <button
                    type="button"
                    className="primary"
                    onClick={createHandler}>
                    Create Product
                </button>
            </div>
            { deleteLoading && <LoadingBox></LoadingBox>}
            { deleteError && (
                <MessageBox variant="danger">{deleteError}</MessageBox>
            )}
            {loadingCreate && <LoadingBox></LoadingBox>}
            {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {/* map function是() =>(), not () => {} */}
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                                <button
                                    type="button"
                                    className="small"
                                    onClick={()=> props.history.push(`/product/${product._id}/edit`)}
                                    >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="small"
                                    onClick={()=>deleteHandler(product)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
    );
};

export default ProductListScreen;