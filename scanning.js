const puppeteer = require('puppeteer');
require('dotenv').config;
const axios = require('axios');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.use(express.json());
app.get('/', (req, res) => {
  res.status(200).json({
    "Alert":"Hello",
  });
});


app.listen(PORT,() => {
  console.log("Server Start Running");
});
// senData();
const sendDataInEmail = [];
const db = admin.firestore();
var currentPageURL = "";
var realUrl = "";



// setWebsiteData();
var count = 0;
const websitedata = []; 
const dataArray = [];
var countDiscountMessage = 0;
var codToke  = ""; 

var minprice  = 0; 
let discountpercentagee = 0;
getWebsiteData();
setInterval(getWebsiteData, 4 * 60 * 60 * 1000);


async function getWebsiteData() {
  var data; 
  if(count == dataArray.length){
    count = 0;
    dataArray.length = 0;
  }else{
    return;
  }

  try {
      const snapshot = await db.collection("tokens").get();
      const tokendata = snapshot.docs[0].data();
      codToke = tokendata['token'];
      minprice = tokendata['minprice'];
      discountpercentagee = tokendata['discountpercentage'];
      // Assuming setWebsiteData is an asynchronous function
  } catch (error) {
    console.error('Error getting documents:', error);
  }

  try {
    var snapshot = await db.collection("storeurls").get();
    snapshot.forEach((doc) => {
        data = doc.data();
      websitedata.push(data);
    });
    for (let i = 0; i < websitedata.length; i++) {
      snapshot = await db.collection("storefields").where('storename', '==', websitedata[i].storename).get();
      if(snapshot.empty){

      }else{
       
        dataArray.push({
          parentdivclass: snapshot.docs[0].data().parentdivclass,
          producturlclass:  snapshot.docs[0].data().producturlclass,
          url:  websitedata[i].categoryurl,
          imgclass:  snapshot.docs[0].data().imgclass,
          descpclass: snapshot.docs[0].data().descpclass,
          currclass: snapshot.docs[0].data().currclass,
          priceclass: snapshot.docs[0].data().priceclass,
          paginationpageclass: snapshot.docs[0].data().paginationpageclass,
          paginationurltxt: snapshot.docs[0].data().paginationurltxt,
          paginationurlvalue: snapshot.docs[0].data().paginationurlvalue,
        });
      }
    }
    console.log(dataArray); // This will print the array with your Firestore collection data
    // Assuming setWebsiteData is an asynchronous function
    if(dataArray.length>0){
      await setWebsiteData(dataArray);

    }else{
      console.log("No store data available");
    }
  } catch (error) {
    console.error('Error getting documents:', error);
  }
}

async function setWebsiteData(addingUrlData) {
  console.log("Added Data Displayed:" + addingUrlData[0]['url'].toString());
  realUrl = addingUrlData[0]['url'].toString();

  for (let i = 0; i < addingUrlData.length; i++) {
    try{
      realUrl = addingUrlData[i]['url'].toString();
        // You can add any necessary logic here, similar to the Dart code.
      count+=1;
      await scrapeWebsiteUrl(
        addingUrlData[i]['parentdivclass'].toString(),
        addingUrlData[i]['producturlclass'].toString(),
        addingUrlData[i]['url'].toString(),
        addingUrlData[i]['imgclass'].toString(),
        addingUrlData[i]['descpclass'].toString(),
        addingUrlData[i]['currclass'].toString(),
        addingUrlData[i]['priceclass'].toString(),
        addingUrlData[i]['paginationpageclass'].toString(),
        addingUrlData[i]['paginationurltxt'].toString(),
        parseInt(addingUrlData[i]['paginationurlvalue'].toString())
      );
    }catch (error) {
      console.error('Error in Website Urls Fields:', error);
    }
  }
}

// Add a new document with a generated ID to a collection
async function scrapeWebsiteUrl(parentdivclass,producturlclass,urls,imgclass,descpclass,currclass,priceclass,paginationpageclass,paginationurltxt,paginationurlvalue) {
  console.log('Received a POST request to /v1/sendbotdata');
  const data = [];
  const browser = await puppeteer.launch({
    args:[
    "--disable-setuid-sandbox",
    "--no-sandbox",
    "--single-process",
    "--no-zygote", 
    ], 
    executablePath: process.env.NODE_ENV === "production" 
    ? process.env.PUPPETEER_EXECUTABLE_PATH
    :puppeteer.executablePath(),
    headless: true,
    timeout: 0 
  });

  try {
    var page = await browser.newPage();
    const url = urls;
    var paginurltxt;
    var paginurlval = paginationurlvalue;

    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided.');
    }

    if(paginationurltxt != "" && paginationurltxt != null){
     paginurltxt = paginationurltxt;
    }

    await page.goto(url, { timeout: 0, waitUntil: 'domcontentloaded' });
    await page.setRequestInterception(false);
    var paginationElements;

    // Check if pagination elements exist
    if(!paginationpageclass || paginationpageclass.length === 0){
    }else{
     paginationElements = await page.$$(paginationpageclass);
    }

    if (paginationpageclass == "") {
      // No pagination elements found, scrape data from a single page
      const imageUrls = await page.$$eval(imgclass, images => {
        return images.map(img => img.src);
      });

      const descp = await page.$$(descpclass);
      const curr = await page.$$(currclass);
      const elements = await page.$$(priceclass);

      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        const description = descp[i];
        const priceElement = elements[i];
        const currencyElement = curr[i];

        if (!priceElement || !currencyElement || !description) {
          console.log(`Skipping index ${i} due to missing elements.`);
          continue;
        }

        const priceProperty = await priceElement.getProperty('textContent');
        const currencyProperty = await currencyElement.getProperty('textContent');
        const descriptionProperty = await description.getProperty('textContent');

        const desc = await descriptionProperty.jsonValue();
        const price = await priceProperty.jsonValue();
        const currency = await currencyProperty.jsonValue();

        data.push({
          'description': desc,
          'imageurl': imageUrl,
          'price': price,
          'currency': currency,
          'websiteurl':url,
        });
      }
    } else {
      // Pagination elements found, navigate through paginated pages
      let pageCounter = 1;
      let datacount = 0;

      while (true) {
        currentPageURL = url+paginurltxt+pageCounter;
        console.log(currentPageURL);
        await page.close();
        page = await browser.newPage();
        try {
          try{
            await page.goto(currentPageURL, { timeout: 0, waitUntil: 'domcontentloaded' });
          }catch(e){
            console.log("Frame Error not working");
            continue;
          }
        } catch (error) {
          console.error('Error navigating to page:', error);
        }

        await page.waitForTimeout(8000);
        if(imgclass == null || imgclass == ""){
          break;
        }
        const imgSelector = imgclass; // Replace with the selector for the <img> element
        const checknextpagedata = await page.$$(descpclass);

        if(checknextpagedata.length == 0 || checknextpagedata == null ){
          datacount+=1;

          console.log('Images selectors not found on the next page. Stopping program.');
          if(datacount>=3){
            break; // Exit the loop
            
          }
          continue;
        }
        datacount = 0;
        const imgElem = await page.waitForSelector(imgSelector); // Adjust the timeout as needed

        if (!imgElem) {
          await page.waitForTimeout(8000); 
          if (!imgElem) {
            console.log('Data not found on the next page. Stopping program.');
            break; // Exit the loop
          } 
        }

        // Add an event listener to the <img> element to check for the 'load' event
        await page.evaluate((selector) => {
          const imgElement = document.querySelector(selector);
          new Promise((resolve) => {
            imgElement.addEventListener('load', resolve);
          });
        }, imgclass);

        const scrollStep = 280; // The number of pixels to scroll in each step
        const scrollInterval = 1000; // The time interval (in milliseconds) between each step
        var imageUrl = "";
        const maxScrollHeight = await page.evaluate(() => document.body.scrollHeight);
        let currentScrollHeight = 0;

        while (currentScrollHeight < maxScrollHeight) {
          await page.evaluate((scrollStep) => {
            window.scrollBy(0, scrollStep);
          }, scrollStep);

          await page.waitForTimeout(scrollInterval);
          currentScrollHeight += scrollStep;
        }

        // Collect image URLs
        await page.waitForTimeout(5000); 
        await page.waitForSelector(imgclass);
        const imageUrlss = await page.$$eval(imgclass, (images) => {
          return images.map((img) => img.getAttribute('src'));
        });

        const parentElements = await page.$$(parentdivclass);
        console.log(parentdivclass);
        console.log("Parent Element Length: "+parentElements.length.toString());

        var desc = [];
        var imageUrls = [];
        var price = [];
        var prodUrl = "";

        for (const parentElement of parentElements) {
          const descElements = await parentElement.$$(descpclass);
          const imageElements = await parentElement.$$(imgclass);
          const priceElements = await parentElement.$$(priceclass);
          const productElements = await parentElement.$$(producturlclass);
          
          console.log("Descp Length: "+descElements.length);
          console.log("Product Length: "+productElements.length);
          console.log("Image Length: "+imageElements.length);
          console.log("Price Length: "+priceElements.length);
          console.log("Peoduct Url Class: "+producturlclass);
            
          if (descElements.length > 0 && imageElements.length > 0 && priceElements.length > 0 ) {
            const descText = await descElements[0].evaluate(element => element.textContent);
            if(productElements.length >0){
              prodUrl = await productElements[0].evaluate(element => element.getAttribute('href'));
              if(prodUrl.includes("https")){

              }else{
                prodUrl = realUrl+prodUrl;
              }
              
            }else{
                prodUrl = "no product url";
              
            }

            const imageUrl = await imageElements[0].evaluate(element => element.getAttribute('src'));
            const priceText = await priceElements[0].evaluate(element => element.textContent);
            console.log("Data Pushed");

            data.push({
              'description': descText,
              'producturl':prodUrl,
              'imageurl': imageUrl,
              'price': priceText,
              'currency': priceText,
              'websiteurl':currentPageURL
            });
          } else {
            if(descElements.length > 0 && priceElements.length > 0 ){
              const descText = await descElements[0].evaluate(element => element.textContent);
              if(productElements.length >0){
                prodUrl = await productElements[0].evaluate(element => element.getAttribute('href'));
              }else{
                  prodUrl = "no product url";
                
              }
              const imageUrl = "no image";
              const priceText = await priceElements[0].evaluate(element => element.textContent);
              console.log("Data Pushed");

              data.push({
                'description': descText,
                'producturl':prodUrl,
                'imageurl': imageUrl,
                'price': priceText,
                'currency': priceText,
                'websiteurl':currentPageURL
              });
            }
            console.log("Data is missing for a specific instance.");
          }
        }
        // Check if there are no more pages to scrape
        const hasNextPage = await page.$(paginationpageclass);
        console.log("I run");
        console.log("Data Length:"+data.length.toString());
        pageCounter+=paginurlval;
      }
    }
    await page.close(); // Close the page
    await browser.close();
    await SaveProducts(data,currentPageURL);    
  } catch (error) {
    console.log("Something is going wrong");
    console.error(error);
    await SaveProducts(data,currentPageURL);
  } finally {
    await browser.close();
  }
}

async function SaveProducts(productData, websiteurl) {
  const productprice = 2260;
  let discountprice = 0.0;
  let newprice = 0.0;
  let oldprice = 0.0;
  let price = 0.0;
  var discountpercent  = 0;
  
  try {
    const snapshot = await db.collection("tokens").get();
    const tokendata = snapshot.docs[0].data();
    codToke = tokendata['token'];
    minprice = tokendata['minprice'];
    discountpercentagee = tokendata['discountpercentage'];
    // Assuming setWebsiteData is an asynchronous function
    // await setWebsiteData(dataArray);
  } catch (error) {
    console.error('Error getting token:', error);
  }
  console.log('Save product data length: ' + productData.length.toString());

  for (let i = 0; i < productData.length; i++) {
    console.log('Firestore Index: ' + i);
    setTimeout(() => {
    }, 2000);

    try{
      const snapshot = await db.collection('products')
      .where('productdescp', '==', productData[i].description)
      .get();
      console.log('Date is saving in Firestore');

      if (snapshot.empty) {
        console.log('No Data found');
        const newProductRef = await db.collection('products').add({
          imageurl:productData[i].imageurl,
          productdescp: productData[i].description,
          producturl:productData[i].producturl,
          oldprice: productData[i].price.toString(),
          oldpricedate: new Date(),
          newprice: productData[i].price.toString(),
          newpricedate: new Date(),
          productcurrency: productData[i].currency,
          websiteurl: productData[i].websiteurl,
        });

        console.log('Data added with ID: ', newProductRef.id);
      } else {
        console.log('I am here in matching prices');
        const regExp = new RegExp('[\\d.]+');

        // Use the exec method to find the first match in the input string
        const newpriceString = snapshot.docs[0].data().newprice.toString();
        const match = regExp.exec(newpriceString);
        newprice = match ? parseFloat(removeFirstDotIfTwo(match[0])) : 0.0;

        const priceString = productData[i].price.toString();
        const matchPrice = regExp.exec(priceString);
        price = matchPrice ? parseFloat(removeFirstDotIfTwo(matchPrice[0])) : 0.0;

        const oldpriceString = snapshot.docs[0].data().oldprice.toString();
        const matchOldPrice = regExp.exec(oldpriceString);
        oldprice = matchOldPrice ? parseFloat(removeFirstDotIfTwo(matchOldPrice[0])) : 0.0;

        console.log('Product Description is: ' + snapshot.docs[0].data().productdescp);
        if (snapshot.docs[0].data().productdescp === productData[i].description && newprice !== 0 && newprice !== price){
          console.log('New Price changed');
          discountprice = newprice - price;
          discountpercent = parseInt((discountprice / newprice) * 100);
          console.log('Id of Product: ' + snapshot.docs[0].id);

          if(discountpercent > 40){
            await db.collection('products').doc(snapshot.docs[0].id).update({
              oldprice: snapshot.docs[0].data().newprice.toString(),
              oldpricedate: snapshot.docs[0].data().newpricedate.toDate(),
              newprice: productData[i].price.toString(),
              newpricedate: new Date(),
              discountpercentage: discountpercent,

            });

            if(discountpercent >= discountpercentagee && newprice > minprice && newprice > price){
              sendDataInEmail.push({
                image: productData[i].imageurl,
                description: productData[i].description,
                producturl:productData[i].producturl,
                oldprice: snapshot.docs[0].data().newprice,
                oldpricedate:formatDateTime(snapshot.docs[0].data().newpricedate.toDate()),
                newprice: productData[i].price,
                newpricedate:formatDateTime(new Date()),
                discountpercentage: discountpercent,
                websiteurl: productData[i].websiteurl,
              });  
            }
          }
        } else {
          console.log('No data changed');
        }
      }

      if (sendDataInEmail.length >= 15) {
        console.log('Send Data Length Is High');
        // Call your email sending function or Discord message sending function here.
        // await sendEmail(sendDataInEmail, websiteurl);
        countDiscountMessage = 0;
        await sendMessageToDiscord(sendDataInEmail, websiteurl);
        sendDataInEmail.length = 0;
      }
    }catch (error) {
      console.error('Error From Firestore:', error);
    }
  }

  if (sendDataInEmail.length > 0 && sendDataInEmail.length < 15) {
    console.log('Send Data Length Is High');
    // Call your email sending function or Discord message sending function here.
    // await sendEmail(sendDataInEmail, websiteurl);
     countDiscountMessage = 0;
    await sendMessageToDiscord(sendDataInEmail, websiteurl);
    sendDataInEmail.length = 0;
  }
}

function removeFirstDotIfTwo(value) {
  const dotCount = (value.match(/\./g) || []).length;

  if (dotCount === 2) {
    value = value.replace('.', '');
  }

  return value;
}

function formatDateTime(date) {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear().toString().slice(-2);
  const h = date.getHours().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const min = date.getMinutes().toString().padStart(2, '0');
  const sec = date.getSeconds().toString().padStart(2, '0');

  return `${d}/${m}/${y} ${h}:${min}:${sec} ${ampm}`;
}

async function sendMessageToDiscord(dataList, websiteurl) {
  // const botToken = 'MTE2MTE4NzQ3MDIxODYyNTEyNQ.GgtfQA.J95Jzy-RSq05hiYJIA4mfOQ11HDZ0Z5JJT3Jdc';
  const botToken = codToke;
  const channelId = '1164216355382382644';
  const apiUrl = `https://discord.com/api/v10/channels/${channelId}/messages`;

  const headers = {
    'Authorization': `Bot ${botToken}`,
    'Content-Type': 'application/json',
    'Accept': '*/*',
  };

  const embeds = [];
  var embed = [];
  for (const data of dataList) {
     if(data.image == "no image" || data.image == null || data.image == ""){
      embed = {
      title: data.description,
      description: `- Nuevo Precio: ${data.newprice}\n`
        + `- Fecha Nuevo Precio: ${data.newpricedate}\n`
        + `- Precio Antigüo: ${data.oldprice}\n`
        + `- Fecha Antigüo Precio: ${data.oldpricedate}\n`
        + `- Porcentaje de descuento: ${data.discountpercentage}%\n`
        + `- Product URL: ${data.producturl}`,
      // image: { url: data.image },
    };

     }else{
      embed = {
      title: data.description,
      description: `- Nuevo Precio: ${data.newprice}\n`
        + `- Fecha Nuevo Precio: ${data.newpricedate}\n`
        + `- Precio Antigüo: ${data.oldprice}\n`
        + `- Fecha Antigüo Precio: ${data.oldpricedate}\n`
        + `- Porcentaje de descuento: ${data.discountpercentage}%\n`
        + `- Product URL: ${data.producturl}`,
      image: { url: data.image },
    };
     }

    embeds.push(embed);
  }

  const messageData = {
    embeds,
  };

  try {
     const response = await axios.post(apiUrl, messageData, { headers });

    if (response.status === 200) {
      console.log('Embed message with product information sent successfully.');
      // You can handle success here.
    } else {
      console.error('Failed to send embed message. Status code:', response.status);
      // Handle the error case.
    }
  } catch (error) {
    if (error.response && error.response.status === 429 && countDiscountMessage == 0) {
      // Rate limit exceeded, implement exponential backoff.
       countDiscountMessage = 1;
      const retryAfter = error.response.headers['Retry-After'] || 1000; // Default to 1 second if no Retry-After header.
      console.log(`Rate limit exceeded. Retrying in ${retryAfter} ms.`);
      await new Promise(resolve => setTimeout(resolve, retryAfter));
      // Retry the request.
      return sendMessageToDiscord(dataList, websiteurl);
    } else {
      console.error('Failed to send embed message:', error);
      // Handle other exceptions that may occur during the request.
    }
  }
}