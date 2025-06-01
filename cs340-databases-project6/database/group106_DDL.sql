SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS Potions;
DROP TABLE IF EXISTS Ingredients;
DROP TABLE IF EXISTS Spell_Books;
DROP TABLE IF EXISTS Potion_Transactions;
DROP TABLE IF EXISTS Book_Transactions;
DROP TABLE IF EXISTS Potion_Recipes;

/* The Customers table keeps track of all of Ophelia’s current customers. 
This table stores data for each customer's first name, last name, and email... 
For promotional materials, of course! 
This table is referenced by the Transactions table, to track who's bought what. */ 

CREATE TABLE Customers (
    customer_ID int NOT NULL AUTO_INCREMENT,
    first_name varchar(50),
    last_name varchar(50),
    email varchar(50),
    PRIMARY KEY (customer_ID)
);

/*customers sample data*/

INSERT INTO Customers (
    first_name,
    last_name,
    email
)
VALUES (
    "Harriet",
    "Haystacker",
    "stacking.hay@gmail.com"
),
(
    "Belinda",
    "Blight",
    "blight.on.society@gmail.com"
),
(
    "Walter",
    "Wobbly-legs",
    "my.legs.wobble@gmail.com"
),
(
    "Larry",
    "Lawnmower",
    "larry@gmail.com"
),
(
    "McKinsleigh",
    "Brown",
    "mckinsleigh2006@gmail.com"
);

/* The Transactions table includes data for every transaction made at Ophelia's store.
It stores the ID of the customer who made the purchase, the date, and the payment method.
This table is referenced by the Potions_Transactions and Books_Transactions intersection
tables, to facilitate M:M relationships with potions and books respectively. */

CREATE TABLE Transactions (
    transaction_ID  int NOT NULL AUTO_INCREMENT,
    customer_ID int,
    transaction_date date,
    payment_method varchar(20) not NULL,
    PRIMARY KEY (transaction_ID),
    FOREIGN KEY (customer_ID) REFERENCES Customers(customer_ID)
);

/*transactions sample data*/

INSERT INTO Transactions (
    customer_ID,
    transaction_date,
    payment_method
)
VALUES (
    22,
    2023-01-29,
    "Apple Pay"
),
(
    38,
    2023-02-04,
    "Debit Card"
),
(
    9,
    2023-02-05,
    "Debit Card"
),
(
    12,
    2023-02-05,
    "Debit Card"
),
(
    22,
    2023-02-12,
    "Cash"
);

/* The Potions table includes data for each potion available at Ophelia's store. 
This table stores the data for each potion's name, color, effect, and list price.
This table is referenced by the Recipes table (to track which ingredients are 
required for brewing) as well as the Potions_Transactions table (to track sales). */

CREATE TABLE Potions (
    potion_ID int NOT NULL AUTO_INCREMENT,
    potion_name varchar(50) NOT NULL,
    potion_effect varchar(120) NOT NULL,
    potion_color varchar(20) NOT NULL,
    potion_price int NOT NULL,
    PRIMARY KEY (potion_ID)
);

/*potions sample data*/

INSERT INTO Potions (
    potion_name,
    potion_effect,
    potion_color,
    potion_price
)
VALUES (
    "Potion of Water Breathing",
    "Allows its user to breathe underwater.",
    "blue",
    25
),
(
    "Potion of Intense Focus",
    "Grants its user intense focus.",
    "purple",
    20
),
(
    "Potion of Wondrous Healing",
    "Heals its user from many a wound or sickness.",
    "red",
    40
),
(
    "Potion of Light-Footedness",
    "Makes its user light of foot.",
    "pink",
    20
),
(
    "Potion of Orange Juice",
    "This is a bottle of endless orange juice.",
    "orange",
    9
);


/*ingredients table description*/

CREATE TABLE Ingredients (
    ingredient_ID int NOT NULL AUTO_INCREMENT,
    ingredient_name varchar(50),
    ingredient_source varchar(120),
    PRIMARY KEY (ingredient_ID)
);

/*ingredients sample data*/

INSERT INTO Ingredients (
    ingredient_name,
    ingredient_source
)
VALUES (
    "Sweet-scented rosewater",
    "That sketchy shop at the corner of 5th and Main"
),
(
    "Fresh frog feet",
    "The frog bog"
),
(
    "A perfectly tuned high C",
    "Ophelia's perfectly tuned piano"
),
(
    "Day-old bread",
    "Ophelia's favorite restaurant down south of downtown"
),
(
    "Orange",
    "The orange orchard up north of uptown"
);

/* The Spell_Books table includes data for each magical book available at Ophelia's store. 
This table stores the data for the book's title and list price. This table is referenced 
by the Books_Transactions table, to track sale data for each book. */

CREATE TABLE Spell_Books (
    book_ID int NOT NULL AUTO_INCREMENT,
    book_title varchar(50) NOT NULL,
    book_price int NOT NULL,
    PRIMARY KEY (book_ID)
);

/*spell_books sample data*/

INSERT INTO Spell_Books (
    book_title,
    book_price
)
VALUES (
    "Beginner's Guide to Witchery",
    25
),
(
    "New Age Cooking Spells",
    25
),
(
    "Hitchhiker's Guide to Hexes",
    42
),
(
    "Terrible, Horrible, No-Good Curse Book",
    50
),
(
    "Spell Jars for Dummies",
    19
);


/* ----------------------------------------------------------------------------------- */

/* INTERSECTION TABLES BELOW */
/* each of these exists to faciliate a M:M relationship between two of the tables above. */

/* ----------------------------------------------------------------------------------- */


/*M:N INTERSECTION: SPELL BOOKS TO TRANSACTIONS*/

/* This table exists to faciliate a M:M relationship between Spell_Books and Transactions, 
since one book can be purchased by many customers, and one customer can purchase many 
books, as demonstrated below via sample data. */

CREATE TABLE Book_Transactions (
    transaction_ID int NOT NULL,
    book_ID int NOT NULL,
    book_price int NOT NULL,
    quantity int NOT NULL,
    FOREIGN KEY (transaction_ID) REFERENCES Transactions(transaction_ID) ON DELETE CASCADE,
    FOREIGN KEY (book_ID) REFERENCES Spell_Books(book_ID)
);

/*books_transactions sample data*/

INSERT INTO Book_Transactions (
    transaction_ID,
    book_ID,
    book_price,
    quantity
)
VALUES (    /* this customer purchased 1 copy of book #1, costing $25, as part of transaction #43 */
    1,
    1,
    25,
    1
),
(    /* the same customer also purchased 2 copies of book #4, costing $50 each, in transaction #43 */
    1,      /* perhaps that second copy is a gift for a friend. */
    4,
    50,
    2
),
(
    47,
    2,
    25,
    1
),
(    /* transactions #48 and #49 each list 1 copy of book #3, costing $42 each */
    48,      /* ...magical book club? */
    3,
    42,
    1
),
(
    49,
    3,
    42,
    1
);

/*M:N INTERSECTION: POTIONS TO TRANSACTIONS*/

/* This table exists to faciliate a M:M relationship between Potions and Transactions, 
since one potion can be purchased by many customers, and one customer can purchase many 
potions, as demonstrated below via sample data. */

CREATE TABLE Potion_Transactions (
    transaction_ID int NOT NULL,
    potion_ID int NOT NULL,
    potion_price int NOT NULL,
    quantity int NOT NULL,
    FOREIGN KEY (transaction_ID) REFERENCES Transactions(transaction_ID) ON DELETE CASCADE,
    FOREIGN KEY (potion_ID) REFERENCES Potions(potion_ID)
    
);

/*potions_transactions sample data*/

INSERT INTO Potion_Transactions (
    transaction_ID,
    potion_ID,
    potion_price,
    quantity
)
VALUES (    /* in transaction #1, this customer purchased 10 bottles of potion #4 at $40 each */
    1,     /* well, they certainly intend to heal a lot of injuries. maybe they're an adventurer. */
    3,
    40,
    10
),
(    /* also part of transaction #1, this customer purchased 5 bottles of potion #5 at $20 each */
    1,     /* i suppose wherever they're adventuring to, they want to get there quick. */
    4,
    20,
    5
),
(    /* also part of transaction #48, this customer purchased 1 bottle of potion #5, costing $9 */
    48,     /* any good adventurer had better stay hydrated! */
    5,
    9,
    1
),
(    /* in transaction #51, this customer purchased 1 bottle of potion #5 as well */
    51,     /* must be popular. */
    5,
    9,
    1
),
(
    51,
    4,
    9,
    2
);

/*M:N INTERSECTION: POTIONS TO INGREDIENTS*/

/*The Recipes table exists to faciliate a M:M relationships between Potions and Ingredients, 
as one potion can require many ingredients, and one ingredient may be featured in many potions. */

CREATE TABLE Potion_Recipes (
    potion_recipes_ID int NOT NULL AUTO_INCREMENT,
    potion_ID int NOT NULL,
    ingredient_ID int NOT NULL,
    quantity int, 
    FOREIGN KEY (potion_ID) REFERENCES Potions(potion_ID) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_ID) REFERENCES Ingredients(ingredient_ID),
    PRIMARY KEY (potion_recipes_ID)
);

/*recipes sample data*/

INSERT INTO Potion_Recipes (
    potion_ID,
    ingredient_ID,
    quantity
)
VALUES (
    3,      /* The recipe for potion #3 requires 2 of ingredient #1, 2 of #3, and 1 of #6. */ 
    1,
    2
),
(
    3,
    3,
    2
),
(
    3,
    6,
    1
),
(
    5,      /* The recipe for potion #5 requires 1,597 of ingredient #5. Uh... Wow. */
    5,
    1597
),
(
    5,      /* It also requires just 1 of ingredient #6. Must be pretty potent. */
    6,
    1
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;