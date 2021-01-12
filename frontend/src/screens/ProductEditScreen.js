import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { detailsProducts, updateProduct } from '../actions/productActions';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

const ProductEditScreen = (props) => {
    const productId = props.match.params.id;  // get :id from url

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('')

    const productDetails = useSelector((state) => state.productDetails);
    const { product, loading, error } = productDetails;

    const productUpdate = useSelector((state) => state.productUpdate);
    const {loading:updateLoading, success:updateSuccess, error:updateError} = productUpdate;
    const dispatch = useDispatch();
    useEffect(() => {
        if(updateSuccess){
            props.history.push('/productlist')
        }
        if(!product || product._id !== productId || updateSuccess){
            dispatch({type: PRODUCT_UPDATE_RESET});
            dispatch(detailsProducts(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    },[dispatch, product, productId, updateSuccess, props.history]);
    const updatedProduct = {
        _id: productId,
        name,
        price,
        image,
        brand,
        countInStock,
        description
    }
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct(updatedProduct));
    }
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <div><h1>Edit Product {productId}</h1></div>
                    {updateLoading && <LoadingBox></LoadingBox>}
                    {updateError && <MessageBox variant="danger">{updateError}</MessageBox>}
                    {loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                        <>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="price">Price</label>
                            <input
                                id="price"
                                type="text"
                                placeholder="Enter Price"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="image">Image</label>
                            <input
                                id="image"
                                type="text"
                                placeholder="Enter image"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="category">Category</label>
                            <input
                                id="category"
                                type="text"
                                placeholder="Enter Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="brand">Brand</label>
                            <input
                                id="brand"
                                type="text"
                                placeholder="Enter brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="countInStock">Count In Stock</label>
                            <input
                                id="countInStock"
                                type="text"
                                placeholder="Enter countInStock"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                rows="3"
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label></label>
                            <button className="primary" type="submit">
                                Update
                            </button>
                        </div>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProductEditScreen;