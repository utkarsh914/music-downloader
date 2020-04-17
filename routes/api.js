const express = require('express')
const axios = require('axios')
// const https = require('https')
const router = express.Router()


router.get('/', (req, res)=>{
  let key = "key"
  let q = req.query.q
  var searchAPI = `https://www.googleapis.com/youtube/v3/search?part=id&q=${q}&type=video&key=${key}`
  // var mp3 = {}
  
  axios.get(searchAPI)
    .then(response =>{
      return response.data.items[0].id.videoId
    })
    .then(id=>{
      let mp3API = `http://michaelbelgium.me/ytconverter/convert.php?youtubelink=https://www.youtube.com/watch?v=${id}`
      return axios.get(mp3API)
    })
    .then(response=>{
      return res.json(response.data)
    })
    .catch(err=>{
      return res.json({error: true, message: 'Server side error occured!'})
    })

})


module.exports = router;