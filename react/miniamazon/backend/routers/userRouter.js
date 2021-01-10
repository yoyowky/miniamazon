import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../data.js';
import User from '../models/userModel.js';
import { generateToken } from '../utils.js';
import { isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.get(
    '/seed',
    expressAsyncHandler(async (req, res) => { // show error instead of keep loading
    //   await User.remove({});
      const createdUsers = await User.insertMany(data.users);
      res.send({ createdUsers });
    })
  );


// when we are going to return signin data, we generate a token to authenticate a user
// for  next request, when you create a new resourse, you should set your http where as a 
// post request,  so you can not run this request through browser, need to use postman to test

userRouter.post(
    '/signin', 
    expressAsyncHandler(async(req, res) => {
        //send an ajex request to check the user email in the database
        const user = await User.findOne({email: req.body.email});
        if(user){
            if(bcrypt.compareSync(req.body.password, user.password)){
                res.send({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user), // use this token for next req to autenticake ur req
                });
                return;
            }
        }
        res.status(401).send({message: 'Invalid email or password'}) // The HTTP 401 Unauthorized client error status
    })
)

userRouter.post(
    '/register',
    expressAsyncHandler(async (req, res) => {
      const user = new User({ // create a new user
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
      });
      const createdUser = await user.save(); // save in database
      res.send({ // send back to frontend as userInfo and save in store
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(createdUser),
      });
    })
);

// req在前面！！！
userRouter.get('/:id', expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if(user){
    res.send(user);
  } else {
    res.status(404).send({ message: 'User Not Found'});
  }
}));

// userRouter.put('/profile', isAuth, expressAsyncHandler(async(req, res) => {
//   const user = await User.findById(req.user._id);
//   if(user){
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     if(req.body.password){
//       user.password = bcrypt.hashSync(req.body.password, 8);
//     };
//     const updatedUser = await user.save();
//     res.send({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       isAdmin: updatedUser.isAdmin,
//       token: generateToken(updatedUser),
//     })
//   }
// }))

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);


export default userRouter;