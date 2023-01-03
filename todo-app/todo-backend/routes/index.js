const express = require('express');
const router = express.Router();
const redis = require('../redis')

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics',async (req, res) => {

  const value = await redis.getAsync('todoCount')

  res.send({"added_todos": Number(value) ? Number(value) : 0})
})

module.exports = router;
