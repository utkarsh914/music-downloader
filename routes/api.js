const express = require('express')
const router = express.Router()
const ytdl = require('ytdl-core')
const search = require('youtube-search')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const fs = require('fs')

const opts = {
  maxResults: 1,
  key: process.env.KEY
}

router.get('/search', (req, res) => {
  console.log("key: ", process.env.KEY);
  const q = req.query.q
  search(q, opts, (err, list) => {
    if (err || !list[0]) {
      res.status(201).send({ error: true, message: 'Error Occured! Try again.' })
      console.log("err: ", err);
    } else {
      console.log(list[0]);
      res.status(200).json({ error: false, video: list[0] });
    }
  })
})

router.get('/download', async (req, res) => {
  try {
    const dl_directory = path.join(__dirname, `../tmp`);
    !fs.existsSync(dl_directory) && fs.mkdirSync(dl_directory);

    const { id, name, artist } = req.query;
    const URL = `https://youtube.com/watch?v=${id}`;
    
    // res.header('Content-Type', 'application/octet-stream')
    //   .header('content-disposition', `attachment; filename=${name}.mp3;`)

    const download = ytdl(URL, { quality: 'highest' });
    
    ffmpeg(download)
    // .setFfmpegPath(`/app/vendor/ffmpeg/ffmpeg`)
    .inputFormat('mp4')
    .format('mp3')
    // .audioBitrate(256)
    .outputOptions('-metadata', 'title=' + name)
    .outputOptions('-metadata', 'artist=' + artist)
    .outputOptions('-metadata', 'publisher=' + 'Music-dl by Utkarsh Tiwari')
   	.on('progress', function(progress) {
			console.log(progress)
		})
    .on('end', () => {
      console.log('ended successfully');
      // res.download(path.join(dl_directory, `${name}.mp3`));
      res.download(path.join(dl_directory, `temp.mp3`));
    })
    .on('error', function(err) {
      throw err;
    })
    // .save(path.join(dl_directory, `${name}.mp3`))
    .save(path.join(dl_directory, `temp.mp3`));
    // .writeToStream(res, function(retcode, error){
    //   console.log('file has been converted succesfully');
    // });
    // .pipe(res, {end: true})

  }
  
  catch (e) {
  	console.log(e.message);
    res.status(400).send({ error: true, message: 'Error Occured!' });
  }
})

module.exports = router;
