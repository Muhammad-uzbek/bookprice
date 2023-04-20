import puppeteer from 'puppeteer';
import fs from 'fs';
import mysql from 'mysql';
import { insertMysql, selectMysql, deleteMysqlById } from './methods.js';
import { scrapingAzboBooks, scrapingAsaxiyBooks } from './scraping.js';
import TelegramBot from 'node-telegram-bot-api';
const token = '6232376947:AAED5amYASDDRf61Xsdy0a560N9ws0IuqS0';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


// working part
let urlsQueue = [];
let linkAndModule = [
    {
        link: "asaxiy.uz/",
        module: scrapingAsaxiyBooks
    },
    {
        link: "azbo.uz/",
        module: scrapingAzboBooks
    }
];
let myChatId = 0;

bot.onText(/\/echo (.+)/, (msg, match) => {
  
    const chatId = msg.chat.id;
    const resp = match[1];
        
    bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    let notMatched = true;
    for(let i = 0; i < linkAndModule.length; i++){
        if(msg.text.includes(linkAndModule[i].link)){
            urlsQueue.push(msg.text);
            notMatched = false;
            bot.sendMessage(chatId, "Navbatga qo'shildi");
            console.log(urlsQueue);
        }
    }
    if(notMatched){
        bot.sendMessage(chatId, "Not matched");
    }
    myChatId = chatId;
   
    // if(msg.text.includes("azbo.uz/")){
    //     bot.sendMessage(chatId, "Azbo.uz");
    //     scrapingAzboBooks(msg.text)
    //     .then((data) => {
    //         console.log(data);
    //         insertMysql(data.name, data.author, data.lang, data.alphabet, data.pageCount, data.price, data.availability, data.quantity, data.description, data.imageURL, data.publisher, data.papertype, data.cover, data.urlWebPage, data.seller)
    //         .then((data) => {
    //             console.log(data);
    //             bot.sendMessage(chatId, "Success");
    //         })
    //     })
    //     .catch((err) => {
    //         bot.sendMessage(chatId, err);
    //     })
    // }
    // if(msg.text.includes("asaxiy.uz/")){
    //     bot.sendMessage(chatId, "Asaxiy.uz");
    //     scrapingAsaxiyBooks(msg.text)
    //     // .then((data) => {
    //     //     console.log(data);
    //     //     insertMysql(data.name, data.author, data.lang, data.alphabet, data.pageCount, data.price, data.availability, data.quantity, data.description, data.imageURL, data.publisher, data.papertype, data.cover, data.urlWebPage, data.seller)
    //     //     .then((data) => {
    //     //         console.log(data);
    //     //         bot.sendMessage(chatId, "Success");
    //     //     })
    //     // })
    //     // .catch((err) => {
    //     //     console.log(err);
    //     //     //bot.sendMessage(chatId, err);
    //     // })
    // }
    if(msg.text == "/otchet" && msg.from.username == "javascriptist"){
        selectMysql()
        .then((data) => {
            console.log("tru");
            // fs writeFile 
            fs.writeFile('./otchet.json', JSON.stringify(data), (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
                bot.sendDocument(chatId, './otchet.json');
            });
        })
        .catch((err) => {
            console.log(err);
        })
    }
});

let isItWorking = false;
setInterval(() => {
    let start = new Date();
    if(isItWorking){
        return;
    }
    if(urlsQueue.length > 0){
        linkAndModule.forEach((item) => {
            if(urlsQueue[0].includes(item.link)){
                isItWorking = true;
                item.module(urlsQueue[0])
                .then((data) => {
                    insertMysql(data.name, data.author, data.fullName, data.lang, data.alphabet, data.pageCount, data.price, data.availability, data.quantity, data.description, data.imageURL, data.publisher, data.papertype, data.cover, data.urlWebPage, data.seller)
                    .then((data) => {
                        bot.sendMessage(myChatId, data);
                        urlsQueue.shift();
                        console.log(new Date() - start);
                        console.log("urlsQueue: ", urlsQueue);
                        isItWorking = false;
                    })
                })
                .catch((err) => {
                    bot.sendMessage(myChatId, JSON.stringify("error: "+err));
                })
            }
        })
    }
}, 1000 * 10);

  
// setInterval(() => {
//     let start = new Date();
//     if(urlsQueue.length > 0){
//         urlsQueue.forEach((url) => {
//             linkAndModule.forEach((item) => {
//                 if(url.includes(item.link)){
//                     item.module(url)
//                     .then((data) => {
//                         insertMysql(data.name, data.author, data.fullName, data.lang, data.alphabet, data.pageCount, data.price, data.availability, data.quantity, data.description, data.imageURL, data.publisher, data.papertype, data.cover, data.urlWebPage, data.seller)
//                         .then((data) => {
//                             bot.sendMessage(myChatId, data);
//                             urlsQueue = urlsQueue.filter((item) => {
//                                 return item != url;
//                             })
//                             console.log(new Date() - start);
//                             console.log("urlsQueue: ", urlsQueue);
//                         })
//                     })
//                     .catch((err) => {
//                         bot.sendMessage(myChatId, JSON.stringify("error: "+err));
//                     })
//                 }
//             })
//         })
//     }
// }, 1000 * 50);