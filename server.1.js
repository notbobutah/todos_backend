const express = require('express')
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

// Create server
const app = express()
app.use(bodyParser.json())

// Create database instance and start server
const adapter = new FileAsync('db.json')
console.log('creating restful services for database')
low(adapter)
  .then(db => {
    // Routes
    // GET /todos/:id
    app.get('/todo/', (req, res) => {
        console.log('inside get endpoint')
      res.send({"test":"test"})
    })
    app.get('/todos/:id', (req, res) => {
        console.log('entering endpoint get todos:'+req.params.id)
      const post = db.get('todos')
        .find({ id: req.params.id })
        .value()
        console.log('inside get endpoint:'+post)
      res.send(post)
    })
    app.get('/todos/', (req, res) => {
        console.log('entering endpoint get todos')
      const post = db.get('todos').value()
        console.log('inside get endpoint:'+JSON.stringify(post))
      res.send(post)
    })

    // POST /todos
    app.post('/todos', (req, res) => {
        db.get('todos')
          .push(req.body)
          .last()
          .assign({ id: Date.now().toString() })
          .write()
          .then(post => res.send(post))
      })
    // PUT /todos
    app.put('/todos', (req, res) => {
        db.get('todos')
          .push(req.body)
          .last()
          .assign({ id: Date.now().toString() })
          .write()
          .then(post => res.send(post))
      })
    
    // Set db default values
    return db.defaults({ todos: [] }).write()
  })
  .then(() => {
    app.listen(4000, () => console.log('listening on port 4000'))
  })