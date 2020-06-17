const express = require('express')
const ytdl = require('ytdl-core')
var search = require('youtube-search')
// const https = require('https')
const router = express.Router()

var opts = {
  maxResults: 1,
  key: process.env.KEY
}

router.get('/search', (req, res) => {
  const q = req.query.q
  search(q, opts, (err, list) => {
    if (err || !list[0]) {
      res.status(201).send({ error: true, message: 'Error Occured! Try again.' })
      throw err
    } else {
      console.log(list[0])
      res.status(200).json({ error: false, video: list[0] })
    }
  })
})

router.get('/download', async (req, res) => {
  try {
    const { id, name } = req.query
    const URL = `https://youtube.com/watch?v=${id}`
    // res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    res.header('Content-Type', 'application/octet-stream')
      .header('content-disposition', `attachment; filename=${name}.mp3;`)

    ytdl(URL, {
      format: 'mp3'
    })
      .pipe(res)
  } catch (e) {
    res.status(400).send({ error: true, message: 'Error Occured!' })
  }
})

module.exports = router
