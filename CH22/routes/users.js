const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb')

module.exports = function (db) {
  const user = db.collection('users');

  router.get('/', async function (req, res, next) {
    try {
      //searching
      const wheres = {}

      if (req.query.strings && req.query.stringc) {
        wheres['string'] = new RegExp(`${req.query.strings}`, 'i')
      }

      if (req.query.integers && req.query.integerc) {
        wheres['integer'] = parseInt(`${req.query.integers}`)
      }

      if (req.query.floats && req.query.floatc) {
        wheres['float'] = parseFloat(`${req.query.floats}`)
      }

      if (req.query.datens && req.query.datenc) {
        wheres['daten'] = new Date(`${req.query.datens}`)
      }

      if (req.query.booleans && req.query.booleanc) {
        wheres['boolean'] = JSON.parse(`${req.query.booleans}`)
      }

      //pagination
      const page = req.query.page || 1
      const limit = 3
      const offset = (parseInt(page) - 1) * limit

      const sortBy = req.query.sortBy || '_id'
      const sortMode = req.query.sortMode || 'asc'

      const result = await user.find(wheres).toArray()
      let total = result.length
      const pages = Math.ceil(total / limit)

      const users = await user.find(wheres).limit(limit).skip(offset).sort({[sortBy]: sortMode}).toArray()
      res.json({ data: users, page: parseInt(page), pages: parseInt(pages), offset, sortBy: sortBy, sortMode: sortMode })
    } catch (err) {
      res.json({ err })
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      const result = await user.insertOne({
        string: req.body.string,
        integer: Number(req.body.integer),
        float: parseFloat(req.body.float),
        daten: new Date(req.body.daten),
        boolean: JSON.parse(req.body.boolean)
      })
      const uses = await user.findOne({ _id: ObjectId(result.insertedId) })
      res.json(uses)
    } catch (err) {
      res.json({ err })
    }
  });

  router.get('/:id', async function (req, res, next) {
    try {
      const userss = await user.findOne({ _id: ObjectId(req.params.id) })
      res.json(userss)
    } catch (err) {
      res.json({ err })
    }
  });


  router.put('/:id', async function (req, res, next) {
    try {
      const result = await user.findOneAndUpdate({ _id: ObjectId(req.params.id) },
        {
          $set:
          {
            string: req.body.string,
            integer: Number(req.body.integer),
            float: parseFloat(req.body.float),
            daten: new Date(req.body.daten),
            boolean: JSON.parse(req.body.boolean)
          }
        }, { returnOriginal: false });
      res.json(result.value)
    } catch (err) {
      res.json({ err })
    }
  });


  router.delete('/:id', async function (req, res, next) {
    try {
      const result = await user.findOneAndDelete({ _id: ObjectId(req.params.id) });
      res.json(result.value)
    } catch (err) {
      res.json({ err })
    }
  });

  return router;
}
