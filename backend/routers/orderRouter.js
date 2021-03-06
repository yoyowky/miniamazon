import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { isAuth, isAdmin } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  expressAsyncHandler(async(req, res) => {
    const orders = await Order.find({}).populate('user', 'name'); // get order.user.name
    res.send(orders)
  })
)


orderRouter.post(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        if(req.body.orderItems.length === 0){
            res.status(400).send({message: 'Cart is empty'})
        } else {
            const order = new Order({
                orderItems: req.body.orderItems,
                shippingAddress: req.body.shippingAddress,
                paymentMethod: req.body.paymentMethod,
                itemsPrice: req.body.itemsPrice,
                shippingPrice: req.body.shippingPrice,
                taxPrice: req.body.taxPrice,
                totalPrice: req.body.totalPrice,
                user: req.user._id, // get from isAuth, req decode token and get user info
            });
            const createdOrder = await order.save();
            res
                .status(201)
                .send({
                    message: 'New Order Created',
                    order: createdOrder
                    })
        }
    })
);

// mine 要放在 /:id前面？？？？ 
orderRouter.get(
    '/mine',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const orders = await Order.find({ user: req.user._id });
      res.send(orders);
    })
  );

orderRouter.get(
    '/:id',
    isAuth, // only authenticate user can see the order details
    expressAsyncHandler(async(req, res) => {
        const order = await Order.findById(req.params.id);
        if(order){
            res.send(order);
        } else {
            res.status(404).send({message: 'Order Not Found'});
        }
    })
)


orderRouter.put(
    '/:id/pay',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();
        res.send({ message: 'Order Paid', order: updatedOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id);
    if(order){
      const deleteOrder = await order.delete();
      res.send({
        message: `Success delete order ${req.params.id}`,
        order: deleteOrder
      })
    } else {
      res.status(404).send({message: 'Order Not Found'});
    }
  })
)

orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async(req, res) => {
    const productId = req.params.id;
    const order = await Order.findById(productId);
    if(order){
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.send({
        message: 'Order delivered',
        order: updatedOrder
      });
    } else {
      res.status(404).send({message: 'Order Not Found'});
    }
  })
)

 export default orderRouter;