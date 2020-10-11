const express = require('express');
const router = express.Router()


//handle incoming GET request /orders

router.get('/', (req, res, next) =>{
  res.status(200).json({
      message: 'orders where fetched'
  })
})
router.post('/', (req, res, next) =>{
    const order={
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'orders where created',
        order: order
    })
  })
 router.get('/:orderId', (req, res, next)=>{
    res.status(201).json({
        message: 'Orders details',
        orderId: req.params.orderId
    })
})
router.delete('/:orderId', (req, res, next)=>{
    res.status(201).json({
        message: 'Orders Deleted',
        orderId: req.params.orderId
    })
})
module.exports = router;