const express = require('express');
const {createUser,loginUserCtrl, getallUser,getaUser,deleteAUser,updateAUser, blockUser, unblockUser, handleRefreshToken }= require('../controller/userCtrl');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.get('/all-users',getallUser);
router.get('/refresh',handleRefreshToken);
router.get('/:id',authMiddleware,isAdmin,getaUser);
router.delete('/:id',deleteAUser);
router.put('/edit-user',authMiddleware,updateAUser);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);

module.exports = router;