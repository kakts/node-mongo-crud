const _ = require('lodash');
const MongoDb = require('mongodb');
const MongoClient = MongoDb.MongoClient;

const url = 'mongodb://localhost:27017/app';

let db;

const dbs = {};

MongoClient.connect(url, (err, db) => {
  if (err) {
    console.error(err);
    return
  }
  db = db;

  console.log("[Init] Connected successfully to server. ", url);
  console.log("db", db);
  db.collections((err, collections) => {
    if (err) {
      throw new Error(err);
    }

    console.error("------collections", collections);
    _.each(collections, (data) => {
      console.error("---", data.collectionName);
      const cName = data.collectionName;
      const collection = db.collection(cName);
      dbs[cName] = collection;
    })

    const now = Date.now();
    dbs['User'].insertOne({
      name: 'test-' + now,
      time: now
    });
    console.error("---dbs", dbs);
    db && db.close();
  });

});

function onEnd() {
  db && db.close();
}

process.on('exit', (code) => {
  console.error("node.js process exit event occuered", code);
  onEnd();
});

process.on('uncaughtException', (code) => {
  console.error("node.js process uncaughtException event occuered", code);
  onEnd();
})
