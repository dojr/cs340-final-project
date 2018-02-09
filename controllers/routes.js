module.exports = function(app, exphbs){
  var express = require('express');
  var router = express.Router();
  var sqlFunctions = require('./sqlFunctions.js');


  router.get('/',function(req,res,next){
    var mysql = req.app.get('mysql');
    var cbc = 0;
    var tempArgs = {};
    tempArgs.difHead = "main-header";
    sqlFunctions.getBeers(res, mysql, tempArgs, complete);
    sqlFunctions.getBreweries(res, mysql, tempArgs, complete);

      function complete(){
        cbc++;
        if(cbc>=2){
          res.render('home', tempArgs);
        }
      }
    });


  router.get('/signup', function(req, res, next)
  {
    var cbc = 0;
    var mysql = req.app.get('mysql');
    var tempArgs = {};

    tempArgs.difHead = "secondary-header";
    tempArgs.changeOrder = "flex-3";
    tempArgs.placeholder = "Brews...";
    tempArgs.hidden = "hidden";

    sqlFunctions.getUsers(res, mysql, tempArgs, complete)
    function complete(){
      cbc++;
      if(cbc>=1){
        res.render('signUp',tempArgs);
      }
    }  });

  router.post('/signup', function(req, res, next){
    var mysql = req.app.get('mysql');
    var user = {
      id: 0,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      city: req.body.city,
      state: req.body.state
    };

    sqlFunctions.checkIfUserExist(res, mysql, user)

  });

  router.get('/login',function(req,res,next){

    var tempArgs = {
      difHead: 'secondary-header',
      changeOrder: 'flex-3',
      hidden: 'hidden'
    };

    res.render('login',tempArgs);
  });

  router.post('/login', function(req,res,next){
    var mysql = req.app.get('mysql');
    var user = {
      email: req.body.email,
      password: req.body.password
    };

    sqlFunctions.userLogin(res, mysql, user, app, exphbs);

  });

  router.get('/logout', function(req,res,next){
    var mysql = req.app.get('mysql');

    sqlFunctions.userLogout(res, mysql, app, exphbs);
  });


  router.delete('/signup/:id', function(req,res){
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM user WHERE id = ?";
    var inserts = [req.params.id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if (error){
        res.write(JSON.stringify(error));
        res.status(400);
        res.end();
      }else{
        res.status(202).end();
      }
    })
  });

  router.get('/beer', function(req, res, next)
  {
    var mysql = req.app.get('mysql');
    var cbc = 0;
    var tempArgs = {};

    sqlFunctions.getBeers(res, mysql, tempArgs, complete);
    sqlFunctions.getBreweries(res, mysql, tempArgs, complete);

    function complete(){
      cbc++;
      if(cbc>=2){
        res.render('beer',tempArgs);
      }
    }

  });

  router.post('/beer', function(req, res, next){
    var mysql = req.app.get('mysql');

    var beer = {
      id: 0,
      name: req.body.name,
      ibu: req.body.ibu,
      abv: req.body.abv,
      pid: req.body.pid
    }

    mysql.pool.query('INSERT INTO beer SET ?', beer, function(err, results, fields){
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
      }
      else{
        res.redirect('/beer')
      }
    });

  });

  router.delete('/beer/:id', function(req, res, next){
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM beer WHERE id = ?";
    var inserts = [req.params.id];

    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
      if (error){
        res.write(JSON.stringify(error));
        res.status(400);
        res.end();
      }else{
        res.status(202).end();
      }
    })
  });

  router.get('/brewery', function(req, res, next)
  {
    var cbc = 0;
    var mysql = req.app.get('mysql');
    var tempArgs = {};

      sqlFunctions.getBreweries(res, mysql, tempArgs, complete);

      function complete(){
        cbc++;
        if(cbc>=1){
          res.render('brewery',tempArgs);
        }
      }


  });

  //every post request incrememnts the id by 1 even if its an error;
  router.post('/brewery', function(req, res, next){
    var mysql = req.app.get('mysql');
    var brewery = {
      id: 0,
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state
    };

    mysql.pool.query("INSERT INTO brewery SET ?", brewery, function(err, result, fields){
      if (err){
        res.write(JSON.stringify(err));
        res.end;
      }
      else{
        res.redirect('/brewery');
      }
    });
  });

  router.get('/comment', function(req, res, next){

    var mysql = req.app.get('mysql');
    var cbc = 0;
    var tempArgs = {};

    sqlFunctions.getBreweries(res, mysql, tempArgs, complete);
    sqlFunctions.getBeers(res, mysql, tempArgs, complete);

    function complete(){
      cbc++;
      if(cbc>=2){
        res.render('comment',tempArgs);
      }
    }

  });

  router.post('/comment', function(req, res, next){

    var mysql = req.app.get('mysql');
    var comment = {
      id: 0,
      uid: 1,
      beer_id: req.body.beer_id,
      brew_id: req.body.brew_id,
      text: req.body.text
    }

    mysql.pool.query("INSERT INTO comment SET ?", comment, function(err, result, fields){
      if (err){
        res.write(JSON.stringify(err));
        res.end();
      }
      else{
        var beerPage = '/beer/' + comment.beer_id;
        var brewPage = '/brew/' + comment.brew_id;

        if(comment.beer_id != undefined)
          res.redirect(beerPage);
        else if(comment.brew_id != undefined)
          res.redirect(brewPage);      }
    });


  });

  router.get('/beer/:id', function(req, res, next){

    var mysql = req.app.get('mysql');
    var tempArgs = {};
    var insert = [req.params.id];
    var cbc = 0;

    sqlFunctions.getBeerComments(res, mysql, tempArgs, complete, insert);
    sqlFunctions.getBeerLikes(res, mysql, tempArgs, complete, insert);
    sqlFunctions.getBeer(res, mysql, tempArgs, complete, insert);
    function complete(){
      cbc++;
      if(cbc>=3){
        res.render('commentPage', tempArgs);
      }
    }

  });

  router.get('/brew/:id', function(req, res, next){
    var mysql = req.app.get('mysql');
    var tempArgs = {};
    var insert = [req.params.id];
    var cbc = 0;

    sqlFunctions.getBreweryComments(res, mysql, tempArgs, complete, insert);
    sqlFunctions.getBrewery(res, mysql, tempArgs, complete, insert);
    sqlFunctions.getBrewBeers(res, mysql, tempArgs, complete, insert);

    function complete(){
      cbc++;
      if(cbc>=3){
        res.render('commentPage', tempArgs);
      }
    }

  });

  router.get('/beer/:bid/:cid', function(req, res, next){
    var mysql = req.app.get('mysql');
    var tempArgs = {};
    var inserts = [req.params.cid, req.params.bid];

    sqlFunctions.getBeerComment(res, mysql, tempArgs, inserts);
  });

  router.get('/brew/:bid/:cid', function(req, res, next){
    var mysql = req.app.get('mysql');
    var tempArgs = {};
    var inserts = [req.params.cid, req.params.bid];

    sqlFunctions.getBrewComment(res, mysql, tempArgs, inserts)
  });

  router.put('/beer/:bid/:cid', function(req, res, next){
    var mysql = req.app.get('mysql');
    var inserts = [req.body.text, req.params.cid, req.params.bid];

    sqlFunctions.updateBeerComment(res, mysql, inserts);
  });

  router.put('/brew/:bid/:cid', function(req, res, next){
    var mysql = req.app.get('mysql');
    var inserts = [req.body.text, req.params.cid, req.params.bid];

    sqlFunctions.updateBrewComment(res, mysql, inserts);
  });

  router.get('/like', function(req, res, next){
    var mysql = req.app.get('mysql');
    var cbc = 0;
    var tempArgs = {};

    sqlFunctions.getBeers(res, mysql, tempArgs, complete);
    sqlFunctions.getUsers(res, mysql, tempArgs, complete);
    sqlFunctions.getLikes(res, mysql, tempArgs, complete);

    function complete(){
      cbc++;
      if(cbc>=3){
        res.render('like', tempArgs);
      }
    }
  });

  router.post('/like', function(req, res, next){
    var mysql = req.app.get('mysql');
    var inserts = [req.body.user_id, req.body.beer_id];
    sqlFunctions.userLike(res, mysql, inserts);
  });

  router.get('/:sid', function(req, res, next){
    var mysql = req.app.get('mysql');
    var cbc = 1;
    var state_id = [req.params.sid];
    tempArgs = {};
    sqlFunctions.getBreweriesByState(res, mysql, tempArgs, complete, state_id);

    function complete(){
      cbc++;
      if(cbc>=1){
        res.render('state', tempArgs);
      }
    }
  })



  return router;
};
