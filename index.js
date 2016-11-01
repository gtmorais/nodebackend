var SERVER_NAME = 'eTouchCare'
var PORT = 3000;
var HOST = '127.0.0.1';

var MONGOURL = "";


var MONGOURL = "";

 
var MongoClient = require('mongodb').MongoClient
  ,assert = require('assert')
  ,restify = require('restify')
  , patientsSave = require('save')('patients')
  , server = restify.createServer({ name: SERVER_NAME})


  // Connection URL
  //var url = 'mongodb://localhost:27017/myproject';
  // MongoClient.connect(MONGOURL, function (err, db) {
  //   if (err) {
  //     console.log('Unable to connect to the mongoDB server. Error:', err);
  //   } else {
  //     //HURRAY!! We are connected. :)
  //     console.log('Connection established to', MONGOURL);

  //     // do some work here with the database.

  //     //Close connection
  //     db.close();
  //   }
  // });


  // Use connect method to connect to the server
  if (MONGOURL != '')
  {
    MongoClient.connect(MONGOURL, function(err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to MONGODB server");
    });
  }
  

var dbConn = null;  


  server.listen(PORT, HOST, function () {
    console.log('Server %s listening at %s', server.name, server.url)
    console.log('Resources:')
    console.log(' /patients')
    console.log(' /patients/:id')  

    // Use connect method to connect to the server
    if (MONGOURL != '')
    {
      MongoClient.connect("mongodb://mapd:4mC49k6DSPJhF0zCZO6MkPwyrhIa2FEivGWnjMYHchD3jcvz5bpV2Lih3Uc0wN1ktE6slDEo7ARJPjuaJ5ttuQ==@mapd.documents.azure.com:10250/?ssl=true", function(err, db) {
        assert.equal(null, err);
        dbConn = db;
        console.log("Connected successfully to MONGODB server");
      });
    }
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all patients in the system
server.get('/patients', function (req, res, next) {

  // Find every entity within the given collection
  patientsSave.find({}, function (error, patients) {

    // Return all of the patients in the system
    res.send(patients)
  })
})

// Get a single patient by their patient id
server.get('/patients/:id', function (req, res, next) {

  // Find a single patient by their id within save
  patientsSave.findOne({ _id: req.params.id }, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (patient) {
      // Send the patient if no issues
      res.send(patient)
    } else {
      // Send 404 header if the patient doesn't exist
      res.send(404)
    }
  })
})

// Create a new patient
server.post('/patients', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.doctorID === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('doctorID must be supplied'))
  }
  if (req.params.nurseID === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('nurseID must be supplied'))
  }
  if (req.params.primaryDignosis === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('primaryDignosis must be supplied'))
  }
  var newpatient = {
		_id: req.params.id,
		name: req.params.name, 
    doctorID: req.params.doctorID,
    nurseID: raq.params.nurseID,
    primaryDignosis: raq.params.primaryDignosis
	}

  // Create the patient using the persistence engine
  patientsSave.create( newpatient, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the patient if no issues
    res.send(201, patient)
  })
})

// Update a patient by their id
server.put('/patients/:id', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.doctorID === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('doctorID must be supplied'))
  }
  if (req.params.nurseID === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('nurseID must be supplied'))
  }
  if (req.params.primaryDignosis === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('primaryDignosis must be supplied'))
  }
  
  var newpatient = {
		_id: req.params.id,
		name: req.params.name, 
    doctorID: req.params.doctorID,
    nurseID: raq.params.nurseID,
    primaryDignosis: raq.params.primaryDignosis
	}
  
  // Update the patient with the persistence engine
  patientsSave.update(newpatient, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})

// Delete patient with the given id
server.del('/patients/:id', function (req, res, next) {

  // Delete the patient with the persistence engine
  patientsSave.delete(req.params.id, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})


