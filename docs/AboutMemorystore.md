# How to create a file memorystore.js


## Introduction - Preloaded words

LearnWords comes with a preconfigured ``memorystore.js`` file which contains some German words with English translation.

LearnWords offers a GUI to enter words for learning. 
What is does not offer is to load the data from a CSV file with data which is already available.

A way to do this is to replace the file ``memorystore.js`` with a custom version and thus do an initial load of words. 
You find instructions how to create your own  ``memorystore.js`` file below.


## How to replace the preloaded words

## Step 1

A service like http://www.csvjson.com/csv2json offers online conversion of CSV data to JSON

The very first row is a "header".

````
word, translate
Apfel  ,  apple
Orange   , orange
Papaya   , pawpaw
Himbeeren  , raspberry
Erdbeeren , strawberry
Aprikose   , apricot
Kokosnuss  , coconut
Birne  , pear
Ananas  , pineapple
Guava  , guava
Banane , banana
Melone  , melon
Zitrone  , lemon
Pflaume  , plum
Traube , grape
Mango , mango
Limette , lime
Kirsche , cherry
Kiwi , kiwi
Heidelbeere , blueberry
Brombeere , blackberry
````

This gives a literal array of objects. 


## Step 2

In step 1 we got an array of objects.
It should look like the following code.

````JavaScript

[
  {
    "word": "Apfel",
    "translate": "apple"
  },
  {
    "word": "Orange",
    "translate": "orange"
  },
  {
    "word": "Papaya",
    "translate": "pawpaw"
  },
  {
    "word": "Himbeeren",
    "translate": "raspberry"
  },
  {
    "word": "Erdbeeren",
    "translate": "strawberry"
  },
  {
    "word": "Aprikose",
    "translate": "apricot"
  },
  {
    "word": "Kokosnuss",
    "translate": "coconut"
  },
  {
    "word": "Birne",
    "translate": "pear"
  },
  {
    "word": "Ananas",
    "translate": "pineapple"
  },
  {
    "word": "Guava",
    "translate": "guava"
  },
  {
    "word": "Banane",
    "translate": "banana"
  },
  {
    "word": "Melone",
    "translate": "melon"
  },
  {
    "word": "Zitrone",
    "translate": "lemon"
  },
  {
    "word": "Pflaume",
    "translate": "plum"
  },
  {
    "word": "Traube",
    "translate": "grape"
  },
  {
    "word": "Mango",
    "translate": "mango"
  },
  {
    "word": "Limette",
    "translate": "lime"
  },
  {
    "word": "Kirsche",
    "translate": "cherry"
  },
  {
    "word": "Kiwi",
    "translate": "kiwi"
  },
  {
    "word": "Heidelbeere",
    "translate": "blueberry"
  },
  {
    "word": "Brombeere",
    "translate": "blackberry"
  }
]

````

## Step 3


Open the existing file memorystore.js, delete all code
and paste the following code into it.


````JavaScript
if (LW.db.isEmpty()) {

LW.db.loadWords(

````

Then add what you have got from step 3.

And finally add the closing parenthesis

````JavaScript

);
}

````


## Step 4

If you have got everything correct the result should look like

````JavaScript
/**************************************************
* Learn Words // memorystore.js
* 
* Example of a user generated file
*
* Hannes Hirzel, November 2016
*
* Placed in public domain.
**************************************************/


if (LW.db.isEmpty()) {

LW.db.loadWords(

[
  {
    "word": "Apfel",
    "translate": "apple"
  },
  {
    "word": "Orange",
    "translate": "orange"
  },
  {
    "word": "Papaya",
    "translate": "pawpaw"
  },
  {
    "word": "Himbeeren",
    "translate": "raspberry"
  },
  {
    "word": "Erdbeeren",
    "translate": "strawberry"
  },
  {
    "word": "Aprikose",
    "translate": "apricot"
  },
  {
    "word": "Kokosnuss",
    "translate": "coconut"
  },
  {
    "word": "Birne",
    "translate": "pear"
  },
  {
    "word": "Ananas",
    "translate": "pineapple"
  },
  {
    "word": "Guava",
    "translate": "guava"
  },
  {
    "word": "Banane",
    "translate": "banana"
  },
  {
    "word": "Melone",
    "translate": "melon"
  },
  {
    "word": "Zitrone",
    "translate": "lemon"
  },
  {
    "word": "Pflaume",
    "translate": "plum"
  },
  {
    "word": "Traube",
    "translate": "grape"
  },
  {
    "word": "Mango",
    "translate": "mango"
  },
  {
    "word": "Limette",
    "translate": "lime"
  },
  {
    "word": "Kirsche",
    "translate": "cherry"
  },
  {
    "word": "Kiwi",
    "translate": "kiwi"
  },
  {
    "word": "Heidelbeere",
    "translate": "blueberry"
  },
  {
    "word": "Brombeere",
    "translate": "blackberry"
  }
]


);
}

````



## Step 5

Now open the app by starting ``index.html``.
If it is the first time you start the program your new memorystore.js
code is loaded.

If you have started ``index.html`` before the exiting content is not overwritten
by the new memorystore.js file. To do so you have to reset the database first.

Open 'Developer tools' in the browser and 'web console'.

Execute

    LW.db.removeWords();


Then close the page and reopen ``index.html``. All your new words should appear in the 'Learn' mode.


