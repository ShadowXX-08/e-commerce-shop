const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); 

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Rasm yuklanmadi' });
  }

  res.send({
    message: 'Image uploaded successfully',
    image: req.file.path
  });
});

module.exports = router;