const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 

router.post('/', upload.single('image'), (req, res) => {
  res.send({
    message: 'Image uploaded successfully',
    image: req.file.path // Cloudinary linki
  });
});

module.exports = router;