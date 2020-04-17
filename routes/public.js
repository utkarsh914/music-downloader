const express = require('express')
const axios = require('axios')
// const https = require('https')
const router = express.Router()


router.get('/', (req, res)=>{
  res.sendfile('/public/index.html')
})


module.exports = router;