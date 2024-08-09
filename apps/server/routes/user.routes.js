import express from 'express';

import {  isAuthenticated, isUserAuthenticated, isWorkerAuthenticated } from '../middlewares/auth.js';

import { deleteUser, deleteWorker,getParticularAdmin,getParticularUser, getParticularWorker, getUsers, getWorkers, logOut, logOutAdmin, logOutWorker, loginAdmin, loginUser, loginWorker, registerAdmin, registerUser, registerWorker, getParticularWorkerWithoutId } from '../controllers/user.controllers.js';

// import { loginLimiter, registerLimiter } from '../index.js';

import rateLimit from 'express-rate-limit';

const router = express.Router();

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 100 requests per windowMs
    message: "Too many accounts created from this IP, please try again after 15 minutes"
  });


  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 100 requests per windowMs
    message: "Too many accounts created from this IP, please try again after 15 minutes"
  });


// User->
router.post('/registerUser',registerLimiter,registerUser);
router.post(`/loginUser`,loginLimiter,loginUser);
router.get(`/logoutUser`,isUserAuthenticated,logOut);
router.delete('/deleteUser',isUserAuthenticated,deleteUser)
router.get('/getUsers',isAuthenticated,getUsers);
router.get(`/userProfile`,isUserAuthenticated,getParticularUser);




// ADMIN->
router.post('/registerAdmin',registerLimiter,isAuthenticated,registerAdmin);
router.post('/loginAdmin',loginLimiter,loginAdmin);
router.get('/logoutAdmin',isAuthenticated,logOutAdmin);
router.get('/adminProfile',isAuthenticated,getParticularAdmin)






// WORKER->
router.post('/registerWorker',isAuthenticated,registerWorker);
router.post(`/loginWorker`,loginWorker);
router.get(`/logoutWorker`,isWorkerAuthenticated,logOutWorker);
router.delete('/deleteWorker',isWorkerAuthenticated,deleteWorker)
router.get('/getWorkers',getWorkers);
router.get('/getParticularWorker/:id',getParticularWorker);
router.get(`/workerProfile`,isWorkerAuthenticated,getParticularWorkerWithoutId);



export default router;



// "name":"worker1",
// "email":"worker1@gmail.com",
// "password":"12345678",
// "phone":"1234567890",
// "gender":"Male",
// "address":"1234",
// "occupation":"Barber",
// "salary":"7KperHour",
// "available":"available"