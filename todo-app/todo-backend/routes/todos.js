const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();

const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const value = await redis.getAsync('todoCount');
  console.log(redis, 'mo')
  const nextValue = value ? Number(value) + 1 : 1;

  await redis.setAsync('todoCount', nextValue);
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */

singleRouter.get('/', async (req, res) => {
  if (req.todo) {
    res.send(req.todo)
  } else {
    res.sendStatus(404)
  }
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {

  const value = await redis.getAsync('todoCount');
  
  const nextValue = value ? Number(value) + 1 : 1;

  await redis.setAsync('todoCount', nextValue);

  if (req.todo) {
    const todo = await Todo.updateOne({
      text: req.body.text,
      done: req.body.done
    })
    res.send(todo);
  } else {
    res.sendStatus(404); // Implement this
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
