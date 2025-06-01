/*

Customers DONE 

*/ 

--Create new customer
INSERT INTO Customers (first_name, last_name, email)
VALUES(:first_nameInput, :last_nameInput, :emailInput);
--Read -- show all customers
SELECT * FROM Customers; 
--Update given customer
UPDATE Customers 
SET first_name = :first_nameInput, last_name = :last_nameInput, email = :emailInput 
WHERE customer_ID = :customer_IDInput;
--Delete customer
DELETE FROM Customers WHERE customer_ID = :selected_customer_ID;




/*

Transactions DONE
--This HTML page will also display the Potions_Transactions table and the Books_Transactions Table as well
*/ 
--Get all customer IDs to populate customerID dropdown on Transaction table
SELECT customer_ID FROM Customers; 
--Create -- FOR TRANSACTION TABLE
INSERT INTO Transactions(customer_ID, transaction_date, payment_method)
VALUES(:customer_ID_selectedfromdropdown, :transaction_dateInput, :payment_methodInput);
--Read -- FOR TRANSACTION TABLE
SELECT * FROM Transactions;
--Update -- FOR TRANSACTION TABLE
UPDATE Transactions
SET customer_ID = :customer_ID_selectedfromdropdown, transaction_date = :transaction_dateInput, payment_method = :payment_methodInput
WHERE transaction_ID = :transaction_IDInput;
--Delete -- FOR TRANSACTION TABLE
DELETE FROM Transactions WHERE transaction_ID = :selected_transactionID;

--Get all transaction IDs to populate transactionID dropdown on  POTION_TRANSACTIONS and BOOK_TRANSACTIONS
SELECT transaction_ID FROM Transactions;
---Get all potion names to populate potion name dropdown on  POTION_TRANSACTIONS
SELECT potion_name FROM Potions;
--Get all book title to populate book title dropdown on BOOK_TRANSACTIONS
SELECT book_title FROM Spell_Books;
--Read -- FOR POTION_TRANSACTIONS TABLE
SELECT Potions.potion_name, Transactions.transaction_ID, Potions.potion_price, Potion_Transactions.quantity
FROM Potion_Transactions
JOIN Potions ON Potions.potion_ID = Potion_Transactions.potion_ID
JOIN Transactions ON Transactions.transaction_ID = Potion_Transactions.transaction_ID;

--Read -- FOR BOOK_TRANSACTIONS TABLE
SELECT Transactions.transaction_ID, Spell_Books.book_title, Spell_Books.book_price, Book_Transactions.quantity
FROM Book_Transactions
JOIN Spell_Books ON Spell_Books.book_ID = Book_Transactions.book_ID
JOIN Transactions ON Transactions.transaction_ID = Book_Transactions.transaction_ID;

--Create -- FOR POTION_TRANSACTIONS TABLE
INSERT INTO Potion_Transactions(potion_ID, transaction_ID, potion_price, quantity)
VALUES(:potion_name_selectedfromdropdown, :transaction_ID_selectedfromdropdown, :potion_priceInput, :quantityInput);

--Create --FOR BOOKS_TRANSACTIONS TABLE
INSERT INTO Book_Transactions(book_ID, transaction_ID, book_price, quantity)
VALUES(:book_title_selectedfromdropdown, :transaction_ID_selectedfromdropdown, :book_priceInput, :quantityInput);

/*

Potions DONE

*/ 

--Create new potion
INSERT INTO Potions (potion_name, potion_effect, potion_color, potion_price)
VALUES(:potion_nameInput, :potion_effectInput, :potion_colorInput, :potion_priceInput);
--Read -- display all potions
SELECT * FROM Potions;
--Update potion
UPDATE Potions 
SET potion_name = :potion_nameInput, potion_effect = :potion_effectInput, potion_color = :potion_colorInput, potion_price = :potion_priceInput 
WHERE potion_ID = :potion_IDInput;
--Delete potion
DELETE FROM Potions WHERE potion_ID = :selected_potion_ID;




/*

Ingredients DONE 

*/ 

--Create new ingredient
INSERT INTO Ingredients (ingredient_name, ingredient_source)
VALUES(:ingredient_nameInput, :ingredient_sourceInput);
--Read -- show all ingredients
SELECT * FROM Ingredients;
--Update ingredient
UPDATE Ingredients 
SET ingredient_name = :ingredient_nameInput, ingredient_source = :ingredient_sourceInput 
WHERE ingredient_ID = :ingredient_IDInput;
--Delete ingredient
DELETE FROM Ingredients WHERE ingredient_ID = :selected_ingredient_ID;




/*

Potion_Recipes

*/ 
--Gets all potion names for creating dropdown on potion_recipes table 
SELECT potion_name FROM Potions;
--Gets all ingredient names for creating dropdown on potion_recipes table
SELECT ingredient_name FROM Ingredients;
--Create
INSERT INTO Potion_Recipes (potion_ID, ingredient_ID, quantity)
VALUES(:potion_name_selectedfromdropdown, :ingredient_name_selectedfromdropdown, :quantityInput);
--Read --Should show potion name, ingredient name, and quantity --need to make sure all sample data for this table has a corresponding ID on potion and ingredient tables
SELECT Potions.potion_name, Ingredients.ingredient_name, Potion_Recipes.quantity
FROM Potion_Recipes 
JOIN Potions ON Potions.potion_ID = Potion_Recipes.potion_ID
JOIN Ingredients ON Ingredients.ingredient_ID = Potion_Recipes.ingredient_ID;
--Update
UPDATE Potion_Recipes 
SET potion_ID = :potion_ID_selectedfromdropdown, ingredient_ID = :ingredient_ID_selectedfromdropdown, quantity = :quantityInput) 
WHERE potion_recipes_ID = :potion_recipes_IDInput;
--Delete TAKEN CARE OF WITH ON CASCADE DELTE 





/*

Spell_Books DONE 

*/ 
--Create new book
INSERT INTO Spell_Books (book_title, book_price)
VALUES(:book_titleInput, :book_priceInput);
--Read -- show all books
SELECT * FROM Spell_Books;
--Update book
UPDATE Spell_Books 
SET book_name = :book_nameInput, book_price = :book_priceInput 
WHERE book_ID = :book_IDInput;
--Delete book
DELETE FROM Spell_Books WHERE book_ID = :selected_book_ID;