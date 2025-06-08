//Citation for the follow code:
//Date: 5/24/2023
//Adapted from nodejs-starter-app steps 3-8 to fit project 
//https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js


var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT = 2123;
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');

app.get('/', function(req, res)
    {
        res.render('index');
    });

app.get('/potions', function(req, res)
    {
        let query1 = "SELECT * FROM Potions;";

        db.pool.query(query1, function(error, rows, fields){
            res.render('potions', {data: rows});
        })
    });

// add potion

app.post('/add-potion-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Potions (potion_name, potion_effect, potion_color, potion_price) VALUES ('${data.potion_name}', '${data.potion_effect}', '${data.potion_color}', ${data.potion_price})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Potions;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//delete potion 
app.delete('/delete-potion-ajax/', function(req,res,next){
    let data = req.body;
    let potion_ID = parseInt(data.potion_ID);
    let deletePotion_Transactions = `DELETE FROM Potion_Transactions WHERE potion_ID = ?`;
    let deletePotion_Recipes = `DELETE FROM Potion_Recipes WHERE potion_ID = ?`;
    let deletePotion= `DELETE FROM Potions WHERE potion_ID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deletePotion_Transactions, [potion_ID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deletePotion_Recipes, [potion_ID], function(error, rows, fields) {

                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                        //run third query
                        db.pool.query(deletePotion, [potion_ID], function(error, rows, fields) {
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                res.sendStatus(204);
                            }
                        })
                        
                      }
                  })
              }
  })});
  
  app.put('/put-potion-ajax', function(req,res,next){
    let data = req.body;
    console.log('Data received:', data);
  
    let queryUpdatePotion = `UPDATE Potions SET potion_effect = ? , potion_color = ?, potion_price = ? WHERE potion_ID = ?`; 
    let selectPotion = `SELECT * FROM Potions WHERE potion_ID = ?`
          // Run the 1st query
          db.pool.query(queryUpdatePotion, [`${data.potion_effect}`, `${data.potion_color}`, `${data.potion_price}`, data.potion_name], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              } else {
                db.pool.query(selectPotion, [data.potion_name], function(error,row,fields){
                    if (error){
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                }
                )
              }
  
  })});

  //READ for Spell books
  app.get('/books', function(req, res)
  {
      let query1 = "SELECT * FROM Spell_Books;";

      db.pool.query(query1, function(error, rows, fields){
          res.render('books', {data: rows});
      })
  });

  //CREATE for Spell books
  app.post('/add-book-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Spell_Books (book_title, book_price) VALUES ('${data.book_title}', '${data.book_price}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Spell_Books;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//DELETE spell book
app.delete('/delete-book-ajax/', function(req,res,next){
    let data = req.body;
    let book_ID = parseInt(data.book_ID);
    let deleteBook_Transactions = `DELETE FROM Book_Transactions WHERE book_ID = ?`;
    let deleteBook= `DELETE FROM Spell_Books WHERE book_ID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteBook_Transactions, [book_ID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteBook, [book_ID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

  //UPDATE for Spell Books
  app.put('/put-book-ajax', function(req,res,next){
    let data = req.body;
    console.log('Data received:', data);
  
    let queryUpdateBook = `UPDATE Spell_Books SET book_price = ? WHERE book_ID = ?`; 
    let selectBook = `SELECT * FROM Spell_Books WHERE book_ID = ?`
          // Run the 1st query
          db.pool.query(queryUpdateBook, [`${data.book_price}`, data.book_title], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              } else {
                db.pool.query(selectBook, [data.book_title], function(error,row,fields){
                    if (error){
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                }
                )
              }
  
  })});



//READ for transactions
app.get('/transactions', function(req, res)
{
    let query1 = "SELECT * FROM Transactions;";

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM Potion_Transactions;";

    let query3= "SELECT * FROM Book_Transactions;";

    let query4= "SELECT * FROM Customers;";

    let query5= "SELECT * FROM Potions;";

    let query6= "SELECT * FROM Spell_Books;";
    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let transactions = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let potion_transactions = rows;

            db.pool.query(query3,(error,rows,fields) => {
                let book_transactions = rows;

                db.pool.query(query4,(error,rows,fields) => {
                    let customers = rows;
                    db.pool.query(query5,(error,rows,fields) => {
                        let potions = rows;
                        db.pool.query(query6,(error,rows,fields) => {
                            let books = rows;
                            return res.render('transactions', {transactions: transactions, potion_transactions: potion_transactions, book_transactions: book_transactions, customers: customers, potions:potions, books: books});
                        })
                    })
            })  
        })
    });
});
});
//create for transactions
app.post('/add-transaction-ajax', function(req, res) 
{
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  query1 = `INSERT INTO Transactions (customer_ID, transaction_date, payment_method) VALUES ('${data.customer_ID}', '${data.transaction_date}', '${data.payment_method}')`;
  db.pool.query(query1, function(error, rows, fields){

      // Check to see if there was an error
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400);
      }
      else
      {
          // If there was no error, perform a SELECT * on bsg_people
          query2 = `SELECT * FROM Transactions;`;
          db.pool.query(query2, function(error, rows, fields){

              // If there was an error on the second query, send a 400
              if (error) {
                  
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
              }
              // If all went well, send the results of the query back.
              else
              {
                  res.send(rows);
              }
          })
      }
  })
});
//delete for transaction
app.delete('/delete-transaction-ajax/', function(req, res, next) {
    let data = req.body;
    let transaction_ID = parseInt(data.transaction_ID);
    let deleteBook_Transactions = `DELETE FROM Book_Transactions WHERE transaction_ID = ?`;
    let deletePotion_Transactions = `DELETE FROM Potion_Transactions WHERE transaction_ID = ?`;
    let deleteTransaction = `DELETE FROM Transactions WHERE transaction_ID = ?`;
  
    // Run the first query
    db.pool.query(deleteBook_Transactions, [transaction_ID], function(error, rows, fields) {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
      } else {
        // Run the second query
        db.pool.query(deletePotion_Transactions, [transaction_ID], function(error, rows, fields) {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            // Run the third query
            db.pool.query(deleteTransaction, [transaction_ID], function(error, rows, fields) {
              if (error) {
                console.log(error);
                res.sendStatus(400);
              } else {
                res.sendStatus(204);
              }
            });
          }
        });
      }
    });
  });

//UPDATE transaction
app.put('/put-transaction-ajax', function(req,res,next){
    let data = req.body;
    console.log('Data received:', data);
    let name = data.customer_name
    if (name === " "){
        name = null;
    }
    console.log(name);
    let queryUpdateTransaction = `UPDATE Transactions SET customer_ID = ?, transaction_date = ?, payment_method = ? WHERE transaction_ID = ?`; 
    let selectTransaction = `SELECT * FROM Transactions WHERE transaction_ID = ?`
          // Run the 1st query
          db.pool.query(queryUpdateTransaction, [name, `${data.transaction_date}`,`${data.payment_method}`, data.transaction_ID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              } else {
                db.pool.query(selectTransaction, [data.transaction_ID], function(error,row,fields){
                    if (error){
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                }
                )
              }
  
  })});
  

//CREATE for potion transactions
app.post('/add-potion-transaction-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data)

    // Create the query and run it on the database
    query1 = `INSERT INTO Potion_Transactions (transaction_ID, potion_ID, potion_price, quantity) VALUES ('${data.transaction_ID}', '${data.potion_ID}', ${data.potion_price}, '${data.potion_quantity}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Potion_Transactions;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});
//create for book transaction
app.post('/add-book-transaction-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    console.log(data)
    // Create the query and run it on the database
    query1 = `INSERT INTO Book_Transactions (transaction_ID, book_ID, book_price, quantity) VALUES ('${data.transaction_ID}', '${data.book_ID}', ${data.book_price}, '${data.book_quantity}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Book_Transactions;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

//READ Customer
app.get('/customers', function(req, res)
{
    let query1 = "SELECT * FROM Customers;";

    db.pool.query(query1, function(error, rows, fields){
        res.render('customers', {data: rows});
    })
});

//CREATE Customer
app.post('/add-customer-ajax', function(req, res) 
{
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  query1 = `INSERT INTO Customers (first_name, last_name, email) VALUES ('${data.first_name}', '${data.last_name}', '${data.email}')`;
  db.pool.query(query1, function(error, rows, fields){

      // Check to see if there was an error
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400);
      }
      else
      {
          // If there was no error, perform a SELECT * on bsg_people
          query2 = `SELECT * FROM Customers;`;
          db.pool.query(query2, function(error, rows, fields){

              // If there was an error on the second query, send a 400
              if (error) {
                  
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
              }
              // If all went well, send the results of the query back.
              else
              {
                  res.send(rows);
              }
          })
      }
  })
});

//DELETE Customer
app.delete('/delete-customer-ajax/', function(req,res,next){
    let data = req.body;
    let customer_ID = parseInt(data.customer_ID);
    let deleteTransaction = `DELETE FROM Transactions WHERE customer_ID = ?`;
    let deleteCustomer = `DELETE FROM Customers WHERE customer_ID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteTransaction, [customer_ID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteCustomer, [customer_ID], function(error, rows, fields) {
                    console.log(customer_ID);
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

//UPDATE Customer
app.put('/put-customer-ajax', function(req,res,next){
  let data = req.body;
  console.log('Data received:', data);

  let queryUpdateCustomer = `UPDATE Customers SET last_name = ?, email = ? WHERE customer_ID = ?`; 
  let selectCustomer = `SELECT * FROM Customers WHERE customer_ID = ?`
        // Run the 1st query
        db.pool.query(queryUpdateCustomer, [`${data.last_name}`, `${data.email}`, data.full_name], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            } else {
              db.pool.query(selectCustomer, [data.full_name], function(error,row,fields){
                  if (error){
                      console.log(error);
                      res.sendStatus(400);
                  } else {
                      res.send(rows);
                  }
              }
              )
            }

})});

//READ for potion recipes
app.get('/recipes', function(req, res)
{
    let query1 = "SELECT * FROM Potion_Recipes;";

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM Potions;";

    let query3= "SELECT * FROM Ingredients;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the people
        let recipe = rows;
        
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
            
            // Save the planets
            let potions = rows;
            db.pool.query(query3,(error,rows,fields) => {
                let ingredients = rows;
                return res.render('recipes', {data: recipe, potions: potions, ingredients: ingredients});
            })  
        })
    });
});
//CREATE for potion recipes
app.post('/add-recipe-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Potion_Recipes (potion_ID, ingredient_ID, quantity) VALUES ('${data.potion_name}', '${data.ingredient_name}', ${data.ingredient_quantity})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Potion_Recipes;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});
//DELETE potion recipes
app.delete('/delete-recipe-ajax/', function(req,res,next){
    let data = req.body;
    let potion_recipes_ID = parseInt(data.potion_recipes_ID);
    let deleteRecipe = `DELETE FROM Potion_Recipes WHERE potion_recipes_ID = ?`;

          // Run the 1st query
          db.pool.query(deleteRecipe, [potion_recipes_ID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                res.sendStatus(204);
              }
  })});
// update for recipes
  app.put('/put-recipe-ajax', function(req,res,next){
    let data = req.body;
    console.log('Data received:', data);
  
    let queryUpdateRecipe = `UPDATE Potion_Recipes SET potion_ID = ?, ingredient_ID = ?, quantity = ? WHERE potion_recipes_ID = ?`; 
    let selectRecipe = `SELECT * FROM Potion_Recipes WHERE potion_recipes_ID = ?`
    console.log(data.potion_recipes_ID);
          // Run the 1st query
          db.pool.query(queryUpdateRecipe, [`${data.potion_ID}`, `${data.ingredient_ID}`, `${data.quantity}`, `${data.potion_recipes_ID}`], function(error, rows, fields){
              if (error) {
        
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              } else {
                db.pool.query(selectRecipe, [data.potion_recipes_ID], function(error,row,fields){
                    if (error){
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                }
                )
              }
  
  })});
//READ for Potion Ingredients
app.get('/ingredients', function(req, res)
{
    let query1 = "SELECT * FROM Ingredients;";

    db.pool.query(query1, function(error, rows, fields){
        res.render('ingredients', {data: rows});
    })
});

//CREATE for Ingredients
app.post('/add-ingredient-ajax', function(req, res) 
{
  // Capture the incoming data and parse it back to a JS object
  let data = req.body;

  // Create the query and run it on the database
  query1 = `INSERT INTO Ingredients (ingredient_name, ingredient_source) VALUES ('${data.ingredient_name}', '${data.ingredient_source}')`;
  db.pool.query(query1, function(error, rows, fields){

      // Check to see if there was an error
      if (error) {

          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error)
          res.sendStatus(400);
      }
      else
      {
          // If there was no error, perform a SELECT * on bsg_people
          query2 = `SELECT * FROM Ingredients;`;
          db.pool.query(query2, function(error, rows, fields){

              // If there was an error on the second query, send a 400
              if (error) {
                  
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
              }
              // If all went well, send the results of the query back.
              else
              {
                  res.send(rows);
              }
          })
      }
  })
});

//DELETE ingredient
app.delete('/delete-ingredient-ajax/', function(req,res,next){
    let data = req.body;
    let ingredient_ID = parseInt(data.ingredient_ID);
    let deletePotion_Recipes = `DELETE FROM Potion_Recipes WHERE ingredient_ID = ?`;
    let deleteIngredient= `DELETE FROM Ingredients WHERE ingredient_ID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deletePotion_Recipes, [ingredient_ID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteIngredient, [ingredient_ID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

//UPDATE for ingredient
app.put('/put-ingredient-ajax', function(req,res,next){
  let data = req.body;
  console.log('Data received:', data);

  let queryUpdateIngredient = `UPDATE Ingredients SET ingredient_source = ? WHERE ingredient_ID = ?`; 
  let selectIngredient = `SELECT * FROM Ingredients WHERE ingredient_ID = ?`
        // Run the 1st query
        db.pool.query(queryUpdateIngredient, [`${data.ingredient_source}`, data.ingredient_name], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            } else {
              db.pool.query(selectIngredient, [data.ingredient_name], function(error,row,fields){
                  if (error){
                      console.log(error);
                      res.sendStatus(400);
                  } else {
                      res.send(rows);
                  }
              }
              )
            }

})});

app.listen(PORT, function() {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});