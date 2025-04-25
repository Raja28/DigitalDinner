
const express = require('express');
const router = express.Router()

const { fetchMenu, addToCart, removeFromCart, addressManager, deleteAddress, updateCartQuantity, fetchOrders } = require('../controller/menu');
const { authorize } = require('../middlewares/auth');

router.get('/menu/:menuType', fetchMenu)
router.post('/menu/orders',authorize, fetchOrders)
router.post('/add_to_cart', authorize, addToCart)
router.post('/remove_from_cart', authorize, removeFromCart)
router.post('/manage_address', authorize, addressManager)
router.post('/delete_address', authorize, deleteAddress)
router.post('/manage_quantity', authorize, updateCartQuantity)
// router.get('/menu/:', fetchMenu)

module.exports = router