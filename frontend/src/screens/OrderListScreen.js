import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { listOrders, deleteOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';

const OrderListScreen = (props) => {
    const orderList = useSelector(state => state.orderList);
    const {loading, error, orders} = orderList;
    const orderDelete = useSelector(state => state.orderDelete);
    const {
        loading: deleteLoading,
        success: deleteSuccess,
        error: deleteError,
    } = orderDelete;
    const dispatch = useDispatch();
    useEffect(()=> {
        if(deleteSuccess){
            console.log('22222')
            dispatch({type: ORDER_DELETE_RESET})
        }
        dispatch(listOrders());
    },[deleteSuccess, dispatch])


    const onDeleteHandler = (order)=>{
        if(window.confirm('Are you sure to delete?')){
            dispatch(deleteOrder(order._id));
        }
    }
    return (
        <div>
            <h1>Orders</h1>
            {deleteLoading && <LoadingBox></LoadingBox>}
            {deleteError && (
                <MessageBox variant="danger">{deleteError}</MessageBox>
            )}
            {loading?<LoadingBox></LoadingBox>
            : error?(
                <MessageBox variant="danger">{error}</MessageBox>
            ): (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user.name}</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid? order.paidAt.substring(0, 10) : 'No'}</td>
                                <td>{order.isDelivered? order.deliveredAt.substring(0,10): 'No'}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="small"
                                        onClick={()=>{
                                            props.history.push(`/order/${order._id}`)
                                        }}
                                    >Details</button>
                                    <button
                                        type="button"
                                        className="small"
                                        onClick={() => onDeleteHandler(order)} // need to add in callback, if not, onDeleteHandler will render when open the page
                                    >Delete</button>
                                </td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderListScreen;