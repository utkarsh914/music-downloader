const express = require('express')
const router = express.Router()


//admin dashboard having filter sort functions too
router.get('/', (req, res)=>{
  res.send('Working!')
})


module.exports = router;