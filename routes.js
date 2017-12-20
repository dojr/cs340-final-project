module.exports = function(){
  var express = require('express');
  var router = express.Router();


  function getUsers(res, mysql, tempArgs, complete){
    var sql = "SELECT user.id AS userID, user.first_name AS user_fname, user.last_name AS user_lname, user.email AS userEmail, user.city AS userCity, user.state AS userState FROM user";
        mysql.pool.query(sql, function(err, results, fields){
        if(err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.getUsers = results;
          complete();
        }
      });
  }

  function getBeers(res, mysql, tempArgs, complete){
    var sql = "SELECT beer.id AS beerID, beer.name AS beerName, ibu, abv, b.name AS brewName FROM beer LEFT JOIN brewery b ON b.id = beer.brew_id"
        mysql.pool.query(sql, function(err, results, fields){
        if(err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.getBeer = results;
          complete();
        }
      });
  }

  function getBeer(res, mysql, tempArgs, complete, id){
    var sql = "SELECT beer.id AS beerID, beer.name AS beerName, ibu, abv, b.name AS brewName FROM beer LEFT JOIN brewery b ON b.id = beer.brew_id WHERE beer.id = ?"
    sql = mysql.pool.query(sql, id, function(err, results, fields){
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
      }
      else{
        tempArgs.beer = results;
        complete();
      }
    });
  }

  function getBreweries(res, mysql, tempArgs, complete){
    var sql = "SELECT brewery.id AS brewID, brewery.lat AS lattitude, brewery.lon AS longitude, brewery.name AS brewName, brewery.address AS brew_address, brewery.city AS brewCity, brewery.state AS brewState, brewery.number AS brewNumber, brewery.website AS brewSite, brewery.description AS brewScript FROM brewery"

        mysql.pool.query(sql, function(err, results, fields){
        if(err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.getBrewery = results;
          complete();
        }
      });
  }

  function getBrewery(res, mysql, tempArgs, complete, id){
    var sql = "SELECT brewery.id AS brewID, brewery.lat AS lattitude, brewery.lon AS longitude, brewery.name AS brewName, brewery.address AS brew_address, brewery.city AS brewCity, brewery.state AS brewState, brewery.number AS brewNumber, brewery.website AS brewSite, brewery.description AS brewScript FROM brewery WHERE brewery.id = ?"
    sql = mysql.pool.query(sql, id, function(err, results, fields){
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
      }
      else{
        tempArgs.brewery = results;
        complete();
      }
    });
  }

  function getBrewBeers(res, mysql, tempArgs, complete, id){
    var sql = "SELECT b.name AS beerName FROM brewery LEFT JOIN beer b ON brewery.id = b.brew_id WHERE brewery.id = ?"
    sql = mysql.pool.query(sql, id, function(err, results, fields){
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
      }
      else{
        tempArgs.brew_beers = results;
        complete();
      }
    });
  }

  // gets brewery comments and user associated with comment as well as comment id and brew id.
  function getBreweryComments(res, mysql, tempArgs, complete, id){
    var sql = 'SELECT brewery.id AS brewID, c.id AS comID, c.text AS brewText, u.first_name AS userName FROM brewery LEFT JOIN comment c ON brewery.id = c.brew_id INNER JOIN user u ON c.uid = u.id WHERE brewery.id = ?'
      mysql.pool.query(sql, id, function(err, results, fields){
        if(err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.brewComment = results;
          complete();
        }
      });
  }

  function getBeerComments(res, mysql, tempArgs, complete, id){
    var sql = "SELECT beer.id AS beerID, beer.name AS beerName, c.text AS beerText, c.id AS comID, u.first_name AS userName FROM beer LEFT JOIN comment c ON beer.id = c.beer_id INNER JOIN user u ON c.uid = u.id WHERE beer.id = ?"
    sql = mysql.pool.query(sql, id, function(err, results, fields){
      if(err){
        res.write(JSON.stringify(err));
        res.end();
      }
      else{
        tempArgs.beerComment = results;
        complete();
      }
    });
  }

  function getLikes(res, mysql, tempArgs, complete, id){
    var sql = 'SELECT u.first_name AS userName, b.name AS beerName FROM user_like INNER JOIN user u ON u.id = user_like.uid INNER JOIN beer b ON b.id = user_like.beer_id';
      mysql.pool.query(sql, id, function(err, results, fields){
        if (err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.user_like = results;
          complete();
        }
      });
  }

  function getBeerLikes(res, mysql, tempArgs, complete, id){
    var sql = 'SELECT u.first_name AS userName, b.name AS beerName FROM user_like INNER JOIN user u ON u.id = user_like.uid INNER JOIN beer b ON b.id = user_like.beer_id WHERE b.id = ?';
      mysql.pool.query(sql, id, function(err, results, fields){
        if (err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.user_like = results;
          complete();
        }
      });
  }

  function getBreweriesByState(res, mysql, tempArgs, complete){
    var sql = "SELECT brewery.id AS brewID, brewery.lat AS lattitude, brewery.lon AS longitude, brewery.name AS brewName, brewery.address AS brew_address, brewery.city AS brewCity, brewery.state AS brewState, brewery.number AS brewNumber, brewery.website AS brewSite, brewery.description AS brewScript FROM brewery WHERE brewery.state = 'OR'"

        mysql.pool.query(sql, function(err, results, fields){
        if(err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.getBreweryByState = results;
          complete();
        }
      });
  }

  router.get('/',function(req,res,next){
    var mysql = req.app.get('mysql');
    var cbc = 0;
    var tempArgs = {};

    getBeers(res, mysql, tempArgs, complete);
    getBreweries(res, mysql, tempArgs, complete);

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

    getUsers(res, mysql, tempArgs, complete)
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


    mysql.pool.query('INSERT INTO user SET ?', user, function(err, results, fields){
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
      }
      else{
        res.redirect('/signup')
      }
    });


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

    getBeers(res, mysql, tempArgs, complete);
    getBreweries(res, mysql, tempArgs, complete);

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

      getBreweries(res, mysql, tempArgs, complete);

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

    getBreweries(res, mysql, tempArgs, complete);
    getBeers(res, mysql, tempArgs, complete);

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

    getBeerComments(res, mysql, tempArgs, complete, insert);
    getBeerLikes(res, mysql, tempArgs, complete, insert);
    getBeer(res, mysql, tempArgs, complete, insert);
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

    getBreweryComments(res, mysql, tempArgs, complete, insert);
    getBrewery(res, mysql, tempArgs, complete, insert);
    getBrewBeers(res, mysql, tempArgs, complete, insert);

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
    var b_id = [req.params.bid];
    var com_id = [req.params.cid];

    var sql = "SELECT comment.text AS bText FROM comment WHERE comment.id = ? AND comment.beer_id = ?";
      mysql.pool.query(sql, [com_id, b_id], function(err, results, fields){
        if(err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.comment = results[0];
          tempArgs.beerID = b_id;
          tempArgs.comID = com_id;
          res.render('edit-comment', tempArgs);
        }
      })
  });

  router.get('/brew/:bid/:cid', function(req, res, next){
    var mysql = req.app.get('mysql');
    var tempArgs = {};
    var b_id = [req.params.bid];
    var com_id = [req.params.cid];

    var sql = "SELECT comment.text AS bText FROM comment WHERE comment.id = ? AND comment.brew_id = ?";
      mysql.pool.query(sql, [com_id, b_id], function(err, results, fields){
        if(err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.comment = results[0];
          tempArgs.brewID = b_id;
          tempArgs.comID = com_id;
          res.render('edit-comment', tempArgs);
        }
      })
  });

  router.put('/beer/:bid/:cid', function(req, res, next){
    var mysql = req.app.get('mysql');
    var b_id = [req.params.bid];
    var com_id = [req.params.cid];
    var c_text = [req.body.text];

    var sql = "UPDATE comment SET text=? WHERE id = ? AND beer_id = ?";
    sql = mysql.pool.query(sql,[c_text, com_id, b_id], function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }else{
        res.status(200);
        res.end();
      }
    })
  });

  router.put('/brew/:bid/:cid', function(req, res, next){
    var mysql = req.app.get('mysql');
    var b_id = [req.params.bid];
    var com_id = [req.params.cid];
    var c_text = [req.body.text];
    var sql = "UPDATE comment SET text=? WHERE id = ? AND brew_id = ?";
    sql = mysql.pool.query(sql,[c_text, com_id, b_id], function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }else{
        res.status(200);
        res.end();
      }
    })
  });

  router.get('/like', function(req, res, next){
    var mysql = req.app.get('mysql');
    var cbc = 0;
    var tempArgs = {};

    getBeers(res, mysql, tempArgs, complete);
    getUsers(res, mysql, tempArgs, complete);
    getLikes(res, mysql, tempArgs, complete);

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

    var sql = 'INSERT INTO user_like (uid, beer_id) VALUES (?,?)';
    sql = mysql.pool.query(sql, inserts, function(err, results, fields){
      if (err){
        res.write(JSON.stringify(err));
        res.end();
      }
      else{
        res.redirect('/like');
      }
    })
  });

  router.get('/oregon', function(req, res, next){
    var mysql = req.app.get('mysql');
    var cbc = ;
    tempArgs = {};
    function getBreweriesByState(res, mysql, tempArgs, complete)

    function complete(){
      cbc++;
      if(cbc>=3){
        res.render('like', tempArgs);
      }
    }
  })

  return router;
}();
