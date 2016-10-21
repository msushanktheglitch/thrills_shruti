// This is the server-side file of our mobile remote controller app.
// It initializes socket.io and a new express instance.
// Start it by running 'node app.js' from your terminal.


// Creating an express server

var express = require('express'),
	app = express();

// This is needed if the app is run on heroku and other cloud providers:

var port = process.env.PORT || 8080;

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.

var io = require('socket.io').listen(app.listen(port));

// App Configuration

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'));

// Initialize a new socket.io application

var appsocket = io.on('connection', function (socket) {

	socket.on('action_btn_data', function(data){
		console.log(data.action_btn);
		appsocket.emit('action_btn_data', {
			action_btn: data.action_btn,
			key: data.key
		});
	});

	socket.on('action_btn_status', function(data){
		appsocket.emit('action_btn_status', {
			key: data.key,
			action_status: data.action_status
		});
	});

});

console.log('Shruti\'s game is on http://localhost:' + port);