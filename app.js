var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var path = require('path');
var exphbs = require('express-handlebars');
var hbs = require('handlebars');
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

app.set('mysql', mysql);

//routes.js ==================================================
app.use('/', require('./controllers/routes.js')(app, exphbs));

// ===========================================================

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(port, function(){
  console.log(' ==server listening on port', port);
});
