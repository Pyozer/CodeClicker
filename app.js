/**
 * Modules
 */
var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

/**
 * Routes
 */
var index = require('./routes/index');
var game = require('./routes/game');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// Routes defines
app.get('/', index.load_game_view);
app.post('/game/save', game.save);
app.get('/game/load', game.load_save);
app.get('/game/leaderboard', game.leaderboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handler
app.use(function(err, req, res, next) {
	// Set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// Eender the error page
	res.status(err.status || 500);
	res.render('error.html');
});


/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(8080, "0.0.0.0", function() {
	console.log('Listening on 8080');
});