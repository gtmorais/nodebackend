
var SERVER_NAME = 'myApi'
var PORT = 3000;
var HOST = '127.0.0.1';


var restify = require('restify')
var save = require('save')('products')
var server = restify.createServer({ name: SERVER_NAME})
var sendGetCount = 0, sendPostCount = 0, sendPutCount = 0

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
 
  console.log('Endpoints:')
  console.log('http://127.0.0.1:3000/products method: GET')
  console.log('http://127.0.0.1:3000/products/edit method: POST')
  console.log('http://127.0.0.1:3000/products/edit/ method: PUT')
})

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())

// List all method
server.get('/products', function (req, res, next) {
    sendGetCount++
    console.log("sendGet: received request. Request counts: " + sendGetCount)

    save.find({}, function (error, allItems) {

    console.log("sendGet: sending response")
    res.send(allItems)
  })
})

// Create a new item
server.post('/products/edit', function (req, res, next) {
  sendPostCount++
  console.log("sendPost: received request. Request counts: " + sendPostCount)

  // Make sure name is defined
  if (req.params.product === undefined || req.params.price === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('The parameters Product and Price must be supplied'))
  }
  
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  
   var newProd = {
		name: req.params.product, 
		price: req.params.price
	}

  
  save.create(newProd, function (error, newProd) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
    
    console.log("sendPost: sending response")
    res.send(200)
  })
})

// Update a product by their id
server.put('/products/edit/:id', function (req, res, next) {
  sendPutCount++
  console.log("sendPut: received request. Request counts: " + sendPutCount)
  // Make sure name is defined
  if (req.params.product === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  
  var newProd = {
		_id: req.params.id,
		name: req.params.product, 
		price: req.params.price
	}
  
  // Update the product with the persistence engine
  save.update(newProd, function (error, newProd) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})



