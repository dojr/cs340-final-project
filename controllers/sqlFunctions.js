var sqlFunctions = {

  getUsers: function(res, mysql, tempArgs, complete){
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
  },

  getBeers: function(res, mysql, tempArgs, complete){
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
  },

  getBeer: function(res, mysql, tempArgs, complete, id){
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
  },

  getBreweries: function(res, mysql, tempArgs, complete){
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
  },

  getBrewery: function(res, mysql, tempArgs, complete, id){
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
  },

  getBrewBeers: function(res, mysql, tempArgs, complete, id){
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
  },

  // gets brewery comments and user associated with comment as well as comment id and brew id.
  getBreweryComments: function(res, mysql, tempArgs, complete, id){
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
  },

  getBeerComments: function(res, mysql, tempArgs, complete, id){
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
  },

  getLikes: function(res, mysql, tempArgs, complete, id){
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
  },

  getBeerLikes: function(res, mysql, tempArgs, complete, id){
    var sql = 'SELECT u.first_name AS userName, b.name AS beerName FROM user_like INNER JOIN user u ON u.id = user_like.uid INNER JOIN beer b ON b.id = user_like.beer_id WHERE b.id = ' + mysql.pool.escape(id);
      mysql.pool.query(sql, function(err, results, fields){
        if (err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.user_like = results;
          complete();
        }
      });
  },

  getBreweriesByState: function(res, mysql, tempArgs, complete, id){
    var sql = "SELECT brewery.id AS brewID, brewery.lat AS lattitude, brewery.lon AS longitude, brewery.name AS brewName, brewery.address AS brew_address, brewery.city AS brewCity, brewery.state AS brewState, brewery.number AS brewNumber, brewery.website AS brewSite, brewery.description AS brewScript FROM brewery WHERE brewery.state = " + mysql.pool.escape(id);

        mysql.pool.query(sql, function(err, results, fields){
        if(err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.brewery_state = results;
          complete();
        }
      });
  },

  getBrewComment: function(res, mysql, tempArgs, id){
    var sql = "SELECT comment.text AS bText FROM comment WHERE comment.id = ? AND comment.brew_id = ?";

      mysql.pool.query(sql, id, function(err, results, fields){
        if(err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.comment = results[0];
          tempArgs.brewID = id[1];
          tempArgs.comID = id[0];
          res.render('edit-comment', tempArgs);
        }
      })
  },

  getBeerComment: function(res, mysql, tempArgs, id){
    var sql = "SELECT comment.text AS bText FROM comment WHERE comment.id = ? AND comment.beer_id = ?";
      mysql.pool.query(sql, id, function(err, results, fields){
        if(err){
          res.write(JSON.stringify(err));
          res.end();
        }
        else{
          tempArgs.comment = results[0];
          tempArgs.beerID = id[1];
          tempArgs.comID = id[0];
          res.render('edit-comment', tempArgs);
        }
      })
  },

  updateBrewComment: function(res, mysql, id){
    var sql = "UPDATE comment SET text=? WHERE id = ? AND brew_id = ?";
    sql = mysql.pool.query(sql, id, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }else{
        res.status(200);
        res.end();
      }
    })
  },

  updateBeerComment: function(res, mysql, id){
    var sql = "UPDATE comment SET text=? WHERE id = ? AND beer_id = ?";
    sql = mysql.pool.query(sql,id, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }else{
        res.status(200);
        res.end();
      }
    })
  },

  userLike: function(res, mysql, id){
    var sql = 'INSERT INTO user_like (uid, beer_id) VALUES (?,?)';
    sql = mysql.pool.query(sql, id, function(err, results, fields){
      if (err){
        res.write(JSON.stringify(err));
        res.end();
      }
      else{
        res.redirect('/like');
      };
    });
  },

  checkIfUserExist: function(res, mysql, user){
    mysql.pool.query('INSERT INTO user SET ?', user,function(error, result){
      if (error){
          if(error.code == "ER_DUP_ENTRY"){
            var tempArgs = {
              difHead:"secondary-header",
              changeOrder:"flex-3",
              placeholder: "Brews...",
              hidden: ""
            };

          res.render('signUp',tempArgs);
          }
          else{
            res.write(JSON.stringify(error));
            res.end();
        }
      }
      else{
        res.redirect('/signup')
      }
    });
  },

  userLogin: function(res, mysql, user, app, exphbs){
    var sql = 'SELECT user.password FROM user WHERE password = ' + mysql.pool.escape(user.password) + 'AND email = ' + mysql.pool.escape(user.email);
    mysql.pool.query(sql, function(error, result){
      if (error || result == 0){

          var tempArgs = {
            difHead:"secondary-header",
            changeOrder:"flex-3",
            placeholder: "Brews...",
            hidden: ""
          };
          console.log("UNsuccessful login");

          res.render('login',tempArgs);
      }
      else if(result[0] && result[0].password === user.password){

        var tempArgs = {
          difHead: "main-header",
          placeholder: "Search your favorite brew..."
        }

        app.engine('handlebars', exphbs({defaultLayout: 'mainLogin'}));
        res.render('home', tempArgs);
        console.log("successful login");
    }
    else {
       res.write(JSON.stringify(error));
       res.end();
     }

   });
 },

 userLogout: function(res, mysql, app, exphbs){

   var tempArgs = {
       difHead: "main-header",
       placeholder: "Search your favorite brew..."
   }
   app.engine('handlebars',exphbs({defaultLayout: 'main'}));
   res.render('home.handlebars',tempArgs);
   
 }

}
module.exports = sqlFunctions;
