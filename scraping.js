import puppeteer from 'puppeteer';
import { uzsNumber } from './minifuncs.js';

export const scrapingAzboBooks = async (url) => {
    const obj = {
        name: '',
        author: '',
        fullName: '',
        lang: ``,
        alphabet: ``,
        pageCount: '',
        price: '',
        availability: false,
        quantity: '',
        description: ``,
        imageURL: '',
        publisher: '',
        papertype: 'No info',
        urlWebPage: url,
        seller: 'AzboBooks',
        sellertg: 'azbo_uz',
    };
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.setDefaultNavigationTimeout(0); 
    await page.goto(url);
    // Set screen size
    await page.setViewport({width: 1080, height: 1024});
    // wait a second
    obj.name = await page.waitForSelector('.mb-2.fs-20.fw-600');
    obj.fullName = await page.evaluate(name => name.textContent.trim().toString(), obj.name);
    obj.name = await page.evaluate(name => name.textContent.trim().split(':')[1], obj.name);
    obj.author = obj.fullName.split(':')[0];
    // get h2 fw-600 text-primary class
    const price = await page.waitForSelector('.h2.fw-600.text-primary');
    obj.price = await page.evaluate(price => price.textContent.trim().toString(), price);
    obj.priceNum = uzsNumber(obj.price);
    // get img role="presentation"
    const img = await page.waitForSelector('img[role="presentation"]');
    obj.imageURL = await page.evaluate(img => img.getAttribute('src'), img);
    // find tab_default_1 inside find h6 and get text
    const description = await page.waitForSelector('.tab-content #tab_default_1');
    obj.description = await page.evaluate(description => description.textContent.trim().toString(), description);
    // get input name="quantity"  max value
    const quantity = await page.waitForSelector('input[name="quantity"]');
    obj.quantity = await page.evaluate(quantity => Number(quantity.getAttribute('max')), quantity);
    // get table table-striped table-borderless and get all tr
    const table = await page.waitForSelector('.table.table-striped.table-borderless');
    // get all tr
    const trs = await table.$$('tr');
    // get all trs as array
    const trsArray = await Promise.all(trs.map(async tr => {
        const tds = await tr.$$('td');
        return Promise.all(tds.map(async td => {
            return await page.evaluate(td => td.textContent.trim(), td);
        }));
    }));
    for(let items of trsArray) {
        if(items[0] === 'Muallif') {
            obj.author = items[1];
        } else if(items[0] === 'Til') {
            obj.lang = items[1] || 'No info';
        } else if(items[0] === 'Yozuv') {
            obj.alphabet = items[1] || 'No info';
        } else if(items[0] === 'Betlar soni') {
            obj.pageCount = items[1] || 'No info';
        } else if(items[0] === 'Nashriyot') {
            obj.publisher = items[1] || 'No info';
        } else if(items[0] === 'Тип бумаги:') {
            obj.papertype = items[1] || 'No info';
        } else if(items[0] === 'Muqovasi') {
            obj.cover = items[1] || 'No info';
        }
    }
    if(obj.quantity > 0) {
        obj.availability = true;
    } else {
        obj.availability = false;
    }
    obj.description = obj.description.slice(0, 2000);
    obj.dateMls = Date.now();
    await browser.close();
    return obj;
}

export const scrapingAsaxiyBooks = async (url) => {
    const obj = {
        name: '',
        author: '',
        fullName: '',
        lang: ``,
        alphabet: ``,
        pageCount: '',
        price: '',
        availability: false,
        quantity: '',
        description: ``,
        imageURL: '',
        publisher: '',
        papertype: 'No info',
        urlWebPage: url,
        seller: 'Asaxiy.uz',
        sellertg: 'asaxiybot',
    };
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0); 
    await page.goto(url);
    // Set screen size
    await page.setViewport({width: 1440, height: 1024});
    // wait a second
    obj.name = await page.waitForSelector('.product-title');
    obj.fullName = await page.evaluate(name => name.textContent.trim().toString(), obj.name);
    obj.name = await page.evaluate(name => name.textContent.trim().split(':')[1], obj.name);
    obj.author = obj.name.split(':')[0];
    // get h2 fw-600 text-primary class
    const price = await page.waitForSelector('.price-box_new-price');
    obj.price = await page.evaluate(price => price.textContent.trim().toString(), price);
    obj.priceNum = uzsNumber(obj.price);
    // get img role="presentation"
    const img = await page.waitForSelector('.item__main-img .img-fluid');
    obj.imageURL = await page.evaluate(img => img.getAttribute('src'), img);
    // find tab_default_1 inside find h6 and get text
    const description = await page.waitForSelector('.description__item');
    obj.description = await page.evaluate(description => description.textContent.trim().toString(), description);

    obj.quantity = 666;
    // get table table-striped table-borderless and get all tr
    const table = await page.waitForSelector('.table.table-striped.table-borderless');
    // get all tr
    const trs = await table.$$('tr');
    // get all trs as array
    const trsArray = await Promise.all(trs.map(async tr => {
        const tds = await tr.$$('td');
        return Promise.all(tds.map(async td => {
            return await page.evaluate(td => td.textContent.trim(), td);
        }));
    }));
    for(let items of trsArray) {
        if(items[0] === 'Muallif') {
            obj.author = items[1];
        } else if(items[0] === 'Til') {
            obj.lang = items[1] || 'No info';
        } else if(items[0] === 'Yozuv') {
            obj.alphabet = items[1] || 'No info';
        } else if(items[0] === 'Betlar soni') {
            obj.pageCount = Number(items[1]) || 'No info';
        } else if(items[0] === 'Nashriyot') {
            obj.publisher = items[1] || 'No info';
        } else if(items[0] === `Qog'oz formati`) {
            obj.papertype = items[1] || 'No info';
        } else if(items[0] === 'Muqovasi') {
            obj.cover = items[1] || 'No info';
        }
    }
    const availability = await page.waitForSelector('.more__about-content .text__content.d-flex.align-items-center.mb-3 span.text__content-name');
    const availabilityText = await page.evaluate(availability => availability.textContent.trim(), availability);
    if(availabilityText === '● Sotuvda bor') {
        obj.availability = true;
    } else obj.availability = false;
    obj.description = obj.description.slice(0, 2000);
    obj.dateMls = Date.now();
    console.log(obj);
    await browser.close();
    return obj;
}