const express = require('express');
const {Client} = require('pg');
const fileSystem = require('fs');
const path = require('path');
const logError = require('./utils/errorLogger');
const app = express();
const config = require('./config.js');
 app.use(express.json());

const client = new Client(config.dbConfig);
app.listen(4512, () => {
  console.log("Server is now listening at port 4512");
});
 client.connect();
 app.get("/products", (req, res) => {
  client.query("select * from products", (err, result) => {
    if (!err) {
      res.send(result.rows);
    }else{
      logError(`Query error in /products: ${err.message}`);
      res.status(500).send("Internal Server Error");
    }
  });
});
 
app.get("/v1/products", (req, res) => {
  let limit=req.query.limit||10;
  let offset=req.query.offset||0;
client.query("SELECT * FROM products ORDER BY id desc LIMIT " + limit + " OFFSET "  + offset, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }else{
      logError(`Query error in /v1/products: ${err.message}`);
      res.status(500).send("Internal Server Error");
    }
  });
});
 
app.post("/products", (req, res) => {
  let products = req.body;
  let insertQuery = `insert into products(name,price,category)values('${products.name}',${products.price}, '${products.category}')`;
  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successfull");
    } else {
      logError(`Query error in /products: ${err.message}`);
      res.status(500).send("Internal Server Error");
    }
  });
});
app.put("/products/:id", (req, res) => {
  let id=req.params.id;
  let products = req.body;
  let updateQuery = `update products set name = '${products.name}',price = ${products.price},category='${products.category}' where id = ${id}`;

  client.query(updateQuery, (err, result) => {
    if (!err) {
      res.send("Update was successfull");
    } else {
      logError(`Query error in /products: ${err.message}`);
      res.status(500).send("Internal Server Error");
    }
  });
});

app.delete("/products/:id", (req, res) => {
  let id = req.params.id;
  let deleteQuery = `delete from products where id = ${id}`;

  client.query(deleteQuery, (err, result) => {
    if (!err) {
      res.send("Deletion was successfull");
    } else {
      logError(`Query error in /products: ${err.message}`);
      res.status(500).send("Internal Server Error");
    }
  });
});