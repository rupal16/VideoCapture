const DB_NAME = "pwa-carscan";
const DB_VERSION = 2;
const DB_STORE_NAME = "userData";

let db;

const idb =
  this.indexedDB ||
  this.indexedDB ||
  this.mozIndexedDB ||
  this.webkitIndexedDB ||
  this.msIndexedDB ||
  this.shimIndexedDB;

let dbPromise = null;

this.addEventListener("install", (event) => {
  event.waitUntil((dbPromise = idb.open(DB_NAME, DB_VERSION)));

  dbPromise.onsuccess = () => {
    db = dbPromise.result;
  };

  dbPromise.onupgradeneeded = (event) => {
    const db = dbPromise.result;

    if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
      db.createObjectStore(DB_STORE_NAME, {
        keyPath: "id",
      });
    }
  };
});

this.addEventListener("message", function (e) {
  var origin = e.origin;
  if (origin !== "http://localhost:3000") return;
  let id = e.data.body.id;
  let link = e.data.body.link;
  saveToDb(link, id);
});

function saveToDb(link, id) {
  const tx = db.transaction(DB_STORE_NAME, "readwrite");
  const userData = tx.objectStore(DB_STORE_NAME);
  const image = userData.add({
    id,
    link,
  });

  image.onsuccess = () => {
    tx.oncomplete = () => {
      console.log("Transaction complete");
    };
    console.log("Image Added");
  };

  image.onerror = (event) => {
    console.log("error");
  };
}
