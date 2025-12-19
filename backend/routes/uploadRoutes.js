const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ message: 'Rasm tanlanmagan (image field is missing)' });
    }

    res.send({
      message: 'Image uploaded successfully',
      image: req.file.path
    });
  });
});

module.exports = router;