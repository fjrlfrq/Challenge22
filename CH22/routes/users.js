const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb')

module.exports = function (db) {
  const user = db.collection('users');

  router.get('/', async function (req, res, next) {
    try {
      //searching
      const params = []
      const values = []
      let counter = 1

      if (req.query.string && req.query.stringc) {
        // params.push(`string ilike '%' || $${counter++} || '%'`)
        values.push(req.query.string);
      }

      if (req.query.integer && req.query.integerc) {
        // params.push(`integer = $${counter++}`)
        values.push(req.query.integer);
      }

      if (req.query.float && req.query.floatc) {
        // params.push(`float = $${counter++}`)
        values.push(req.query.float);
      }

      if (req.query.daten && req.query.datenc) {
        // params.push(`daten = $${counter++}`)
        values.push(req.query.daten);
      }

      if (req.query.boolean && req.query.booleanc) {
        // params.push(`boolean = $${counter++}`)
        values.push(req.query.boolean);
      }

      const users = await user.find().toArray()
      res.json(users)
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

  router.post('/', async function (req, res, next) {
    try {
      const result = await user.insertOne(req.body)
      const uses = await user.findOne({ _id: ObjectId(result.insertedId) })
      res.json(uses)
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
            integer: req.body.integer,
            float: req.body.float,
            daten: req.body.daten,
            boolean: req.body.boolean
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
