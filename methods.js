import mysql from 'mysql';
import {apostropheChanger} from './minifuncs.js';

 const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password'
    });
    
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        // create database if not exists
        connection.query("CREATE DATABASE IF NOT EXISTS test", function (err, result) {
            if (err) throw err;
            console.log("Database created");
        });
    });

export async function insertMysqlNoAns(name, author, lang, alphabet, pageCount, price, availability, quantity, description, imageURL, publisher, papertype, cover, urlWebPage, seller) {
    // create database if not exists
   // create a table with columns: id, name, author, lang, price, quantity, description, imageURL, publisher, papertype
   const sql = "CREATE TABLE IF NOT EXISTS `test`.`books` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `author` VARCHAR(255) NOT NULL , `lang` VARCHAR(255) NOT NULL , `alphabet` VARCHAR(255) NOT NULL , `pageCount` NUMERIC NOT NULL , `price` VARCHAR(255) NOT NULL , `availability` VARCHAR(255) NOT NULL , `quantity` NUMERIC NOT NULL , `description` VARCHAR(4000) NOT NULL , `imageURL` VARCHAR(255) NOT NULL , `publisher` VARCHAR(255) NOT NULL , `papertype` VARCHAR(255) NOT NULL , `cover` VARCHAR(255) NOT NULL , `urlWebPage` VARCHAR(255) NOT NULL , `seller` VARCHAR(255) NOT NULL , PRIMARY KEY (`id`), `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)";
   connection.query(sql, function (err, result) {
         if (err) throw err;
        connection.query(`INSERT INTO test.books (name, author, lang, alphabet, pageCount, price, availability, quantity, description, imageURL, publisher, papertype, cover, urlWebPage, seller) VALUES ('${name}', '${author}', "${lang}", '${alphabet}', '${pageCount}', "${price}", '${availability}', '${quantity}', "${mysql.escape(description)}", '${imageURL}', "${publisher}", '${papertype}', '${cover}', '${urlWebPage}', '${seller}')`, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });
}

export async function insertMysql(name, author, fullName, lang, alphabet, pageCount, price, availability, quantity, description, imageURL, publisher, papertype, cover, urlWebPage, seller) {
    return new Promise((resolve, reject) => {
        // create database if not exists
        // create a table with columns: id, name, author, lang, price, quantity, description, imageURL, publisher, papertype
        const sql = "CREATE TABLE IF NOT EXISTS `test`.`books` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `author` VARCHAR(255) NOT NULL ,`fullname` VARCHAR(255) NOT NULL , `lang` VARCHAR(255) NOT NULL , `alphabet` VARCHAR(255) NOT NULL , `pageCount` NUMERIC NOT NULL , `price` VARCHAR(255) NOT NULL , `availability` VARCHAR(255) NOT NULL , `quantity` NUMERIC NOT NULL , `description` VARCHAR(4000) NOT NULL , `imageURL` VARCHAR(255) NOT NULL , `publisher` VARCHAR(255) NOT NULL , `papertype` VARCHAR(255) NOT NULL , `cover` VARCHAR(255) NOT NULL , `urlWebPage` VARCHAR(255) NOT NULL , `seller` VARCHAR(255) NOT NULL , PRIMARY KEY (`id`), `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)";
        connection.query(sql, function (err, result) {
            if (err) reject(err);
            connection.query(`INSERT INTO test.books (name, author, fullname, lang, alphabet, pageCount, price, availability, quantity, description, imageURL, publisher, papertype, cover, urlWebPage, seller) VALUES ('${apostropheChanger(name)}', '${author}', '${apostropheChanger(fullName)}', "${apostropheChanger(lang)}", '${alphabet}', '${pageCount}', "${apostropheChanger(price)}", '${availability}', '${quantity}', "${mysql.escape(description)}", '${imageURL}', "${publisher}", '${papertype}', '${cover}', '${urlWebPage}', '${seller}')`, function (err, result) {
                if (err) reject(err);
                console.log("1 record inserted");
                resolve(`"` + fullName + '" added');
            });
        });
    })
}


// get all data from table and return it
export async function selectMysql() {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM test.books`, function (err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    })
}



// get data from table by id
export async function selectMysqlById(id) {
    connection.query(`SELECT * FROM test.books WHERE id = ${id}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
}
// get data from table by LIKE name
export async function selectMysqlByName(name) {
    connection.query(`SELECT * FROM test.books WHERE name LIKE '%${name}%'`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
}

// get data from table by LIKE author
export async function selectMysqlByAuthor(author) {
    connection.query(`SELECT * FROM test.books WHERE author LIKE '%${author}%'`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
}

// delete data from table by id
export async function deleteMysqlById(id) {
    connection.query(`DELETE FROM test.books WHERE id = ${id}`, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
}


