const express = require('express')
const router = express.Router()
const ytdl = require('ytdl-core')
var search = require('youtube-search')
var ffmpeg = require('fluent-ffmpeg')
const path = require('path')

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
    const { id, name, artist } = req.query
    const URL = `https://youtube.com/watch?v=${id}`
    
    // res.header('Content-Type', 'application/octet-stream')
    //   .header('content-disposition', `attachment; filename=${name}.mp3;`)

    const download = ytdl(URL, { quality: 'highest' })
    
    ffmpeg(download)
    // .setFfmpegPath(`/app/vendor/ffmpeg/ffmpeg`)
    .inputFormat('mp4')
    .format('mp3')
    // .audioBitrate(256)
    .outputOptions('-metadata', 'title=' + name)
    .outputOptions('-metadata', 'artist=' + artist)
    .outputOptions('-metadata', 'publisher=' + 'Music-dl-ut by Utkarsh Tiwari')
   	.on('progress', function(progress) {
			console.log(progress)
		})
    .on('end', () => {
      console.log('ended fuckfessfully')
      res.download(path.join(__dirname, `../public/downloads/${name}.mp3`), (err)=>{
      	res.status(400).send('error fetching audio')
      })
    })
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message)
      res.status(400).send('error fetching audio')
    })
    .save(path.join(__dirname, `../public/downloads/${name}.mp3`))
    // .writeToStream(res, function(retcode, error){
    //   console.log('file has been converted succesfully');
    // });
    // .pipe(res, {end: true})

  } catch (e) {
    res.status(400).send({ error: true, message: 'Error Occured!' })
  }
})

module.exports = router
