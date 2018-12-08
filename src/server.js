const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {MONGO_URL, MONGO_DB_NAME, PORT} = require('./config');
const db = require('./db');
const server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const customers = require('./customersMethods');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://35.233.99.142:3000/');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Authorization, Accept');
  // intercepts OPTIONS method
  // if ('OPTIONS' === req.method) {
  //     // respond with 200
  //     res.send(200);
  // } else {
  //     // move on
  //     next();
  // }
  next();
});

// Routes
// Obtém todos
app.get('/', (req, res, next) => {
  customers.findAll()
    .then((result) => {
      return res
        .status(200)
        .json({
          success: true,
          data: result
        });
    })
    .catch((err) => next(err));
});

// getbyId
app.get('/:id', (req, res, next) => {
  const customerId = req.params.id
  customers.findById(customerId)
    .then((result) => {
      if(!result) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Could not find the customer with ${customerId}id`
          })
      }

      return res
        .status(200)
        .json({
          success: true,
          data: result
        })
    })
    .catch(err => next(err))
})

// post new customer
app.post('/', (req, res, next) => {
  const newCustomer = req.body.customerId
  customers.insert(newCustomer)
    .then(result => {
      return res
        .status(200)
        .json({
          success: true,
          data: result
        })
    })
    .catch(err => next(err))
})

// update customers informations
app.patch('/:id', (req, res, next) => {
  let customerId = req.params.id

  let customerUpdated = req.body.customerId

  customers.update(customerUpdated)
    .then(result => {
      if(!result) {
        return res
          .status(404)
          .json({
            success:false,
            message: `Could not update customer with ${customerId} id`
          })
      }

      return res
        .status(200)
        .json({
          success: true,
          data: result
        })
    })
    .catch(err => next(err))
})

app.delete('/:id', (req, res, next) => {
  const customerId = req.params.id

  customers.delete(customerId)
    .then(result => {
      if(!result) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Could not erase customer with ${customerId} id`
          })
      }

      return res
        .status(200)
        .json({
          success: true,
          data: result
        })
    })
    .catch(err => next(err))
})

app.use((req, res, next) => {
  if (req.db) {
    req.db.close();
  }
  res.status(404).send('Not Found');
});


db.connect(MONGO_URL, MONGO_DB_NAME)
  .then((db) => {
    server.listen(PORT, ()=> console.log(`[INF] Server is running on port ${PORT}`));
  })
  .catch((err) => {
    console.log('[ERR] Ocorreu um erro ao conectar ao MongoDB\n%o', err);
    db.close().catch((err)=> console.log('[ERR] Ocorreu um erro a fechar a conexão ao MongoDB\n%o', err));
  });
