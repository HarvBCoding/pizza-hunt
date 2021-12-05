// create variable to hold db connection
let db;

// establish a connection to IndexedDB database set to version 1
// the request variable acts as an event listener for the database
// that event listener is created when we open the connection to the database using the indexedDB.open() method
const request = indexedDB.open("pizza_hunt", 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc)
request.onupgradeneeded = function (event) {
  // save a reference to the database
  const db = event.target.result;
  //create an object store (table), set it to have an auto incrementing primary key
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

// upon a successful connection
request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradeneeded) or established a connection, save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes run uploadPizza() function to send all local db data to api
  if (navigator.onLine) {
    uploadPizza();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};

// this function will be executed when an attempt is made to submit a new pizza
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access the object store for 'new_pizza'
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // add record to your store with add method
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  // open a transaction on the db
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access your object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  // upon a successful .getAll() execution, this function will run
  getAll.onsuccess = function () {
    // if there was data in indexDB's store, send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(["new_pizza"], "readwrite");
          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore("new_pizza");
          //clear all items in the store
          pizzaObjectStore.clear();

          alert("All saved pizza has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

//listen for app coming back online
window.addEventListener('online', uploadPizza);