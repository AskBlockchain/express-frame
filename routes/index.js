const express = require('express');
const { PinataFDK } = require("pinata-fdk");
const router = express.Router();
require("dotenv").config();

const fdk = new PinataFDK({
  pinata_jwt: "",
  pinata_gateway: process.env.GATEWAY_URL
},
);

router.get('/', async function(req, res, next) {
  try {
    const startingImageCid = "QmUG3h5QZzpiMXqedyGNKc9RLmxYZAA6usvejPe7JHYbZk" // PUT YOUR STARTING IMAGE CID HERE
    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.HOSTED_URL}`,
      input: { text: "Ask a question" },
      aspectRatio: "1.91:1",
      buttons: [
        { label: 'Click to see Random image', action: 'post' }
      ],
      cid: startingImageCid
    });
    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        ${frameMetadata}
      </head>
      <body>
        <div style="background: #fff;">
          <img style="width: 50%; margin: auto;" src="${process.env.GATEWAY_URL}/ipfs/${startingImageCid}" />
        </div>
      </body>
      </html>`
    res.send(html);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

router.post('/', async function(req, res, next) {
  try {
    const answerCids = ["QmSp4fM2bktAfNCzTX75mEK4vooSnRr9s6ExENdCMyfmx6", "QmRa3jeEmfcCsvn13zXJq74aSLxonVMRTF4rTSmnHMLYEF", "QmSbTwx79NQdi9sdFH11nD3P6GkpJBRgTieDaNTVXKzw6Q"];
    const selectedAnswer = answerCids[Math.floor(Math.random() * answerCids.length)];
    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.HOSTED_URL}`,
      input: { text: "Ask a question" },
      aspectRatio: "1.91:1",
      buttons: [
        { label: 'Click to see a Random image', action: 'post' }
      ],
      cid: selectedAnswer
    });
    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        ${frameMetadata}
      </head>
      <body>
      <div style="background: #fff;">
        <img style="width: 50%; margin: auto;" src="${process.env.GATEWAY_URL}/ipfs/${selectedAnswer}" />
      </div>
    </body>
      </html>`

    if (req.body?.trustedData?.messageBytes) {
      console.log(req.body);
      const { isValid, message } = await fdk.validateFrameMessage(req.body);
      console.log(isValid);
      if (isValid) {
        //  Do something interesting with the data
      }
    }
    res.send(html);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;





// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;
