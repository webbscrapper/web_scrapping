const puppeteer = require('puppeteer');
require('dotenv').config;
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    "Alert":"Hello",
  });
})

app.listen(PORT,() => {
  console.log("Server Start Running");
});

app.post('/v1/sendbotdata', async (req, res) => {
  console.log('Received a POST request to /v1/sendbotdata');
  console.log(req.body); // Log the request body
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
      timeout: 0 });
  try {
    
    var page = await browser.newPage();
    const url = req.body.url;
    var paginurltxt;
    var paginurlval = req.body.paginationurlvalue;
    var pageCounter = 1;
    var datacount = 0;


    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided.');
    }
    if(req.body.paginationurltxt != "" && req.body.paginationurltxt != null){
     paginurltxt = req.body.paginationurltxt;
    }
    

  
    await page.goto(url, { timeout: 0, waitUntil: 'domcontentloaded' });
    await page.setRequestInterception(false);
    var paginationElements;

    // Check if pagination elements exist
    if(!req.body.paginationclass || req.body.paginationclass.length === 0){
     

    }else{
     paginationElements = await page.$$(req.body.paginationclass);
  
    }
    // const paginationElements = await page.$$(req.body.paginationclass);

    if (req.body.paginationclass =="") {
      // No pagination elements found, scrape data from a single page
      const imageUrls = await page.$$eval(req.body.imgclass, images => {
        return images.map(img => img.src);
      });

      const descp = await page.$$(req.body.descpclass);
      const curr = await page.$$(req.body.currclass);
      const elements = await page.$$(req.body.priceclass);

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
          'currency': currency
        });
      }
    } else {
      // Pagination elements found, navigate through paginated pages
      

      while (true) {
        const currentPageURL = url+paginurltxt+pageCounter;
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
          if(req.body.imgclass == null || req.body.imgclass == ""){
            break;
          }
          const imgSelector = req.body.imgclass; // Replace with the selector for the <img> element
    // await page.waitForSelector(imgSelector);
    const checknextpagedata = await page.$$(req.body.descpclass);
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
      console.log('Image selector not found on the next page. Stopping program.');
      break; // Exit the loop
    }

    // Add an event listener to the <img> element to check for the 'load' event
    await page.evaluate((selector) => {
      const imgElement = document.querySelector(selector);
       new Promise((resolve) => {
        imgElement.addEventListener('load', resolve);
      });
    }, imgSelector);
         // await page.waitForSelector(req.body.imgclass);
         await page.evaluate(() => {
           window.scrollTo(0, document.body.scrollHeight);
         });


        // Your scraping logic here
        const imageUrls = await page.$$eval(req.body.imgclass, images => {
          return images.map(img => img.src);
        });

        const descp = await page.$$(req.body.descpclass);
        const curr = await page.$$(req.body.currclass);
        const elements = await page.$$(req.body.priceclass);
        const nextpage = await page.$$(req.body.priceclass);

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
            'currency': currency
          });
        }

        // Check if there are no more pages to scrape
        const hasNextPage = await page.$(req.body.paginationpageclass);
        if (!hasNextPage || hasNextPage == "" || hasNextPage == null || imageUrls.length == 0 ) {
          break;
        }
        console.log("I run");

        pageCounter+=paginurlval;
        
      }
    }

    console.log(data);

    await page.close(); // Close the page
    await browser.close();

    res.status(200).json({
      'status_code': 200,
      'data': data,
    });
  } catch (error) {
    console.log("Something is going wrong");
    console.error(error);
    res.status(500).json({
      'status_code': 500,
      'error': 'Internal server error',
      'data':data,
    });
  } finally {
    await browser.close();
  }
});













































// const puppeteer = require('puppeteer');
// require('dotenv').config;
// const express = require('express');
// const app = express();

// app.use(express.json());

// app.listen(8080,() => {
//   console.log("Server Start Running");
// });

// app.post('/v1/sendbotdata', async (req, res) => {
//   console.log('Received a POST request to /v1/sendbotdata');
//   console.log(req.body); // Log the request body

//   try {
//     const browser = await puppeteer.launch({
//       args:[
//       "--disable-setuid-sandbox",
//       "--no-sandbox",
//       "--single-process",
//       "--no-zygote", 
//       ], 
//       executablePath: process.env.NODE_ENV === "production" 
//       ? process.env.PUPPETEER_EXECUTABLE_PATH
//       :puppeteer.executablePath(),
//       headless: true,
//       timeout: 0 });
//     const page = await browser.newPage();
//     const url = req.body.url;
//     var paginurltxt;
//     var paginurlval = req.body.paginationurlvalue;


//     if (!url || typeof url !== 'string') {
//       throw new Error('Invalid URL provided.');
//     }
//     if(req.body.paginationurltxt != "" && req.body.paginationurltxt != null){
//      paginurltxt = req.body.paginationurltxt;
//     }
    

//     const data = [];

//     await page.goto(url, { timeout: 0, waitUntil: 'domcontentloaded' });
//     await page.setRequestInterception(false);
//     var paginationElements;

//     // Check if pagination elements exist
//     if(!req.body.paginationclass || req.body.paginationclass.length === 0){
     

//     }else{
//      paginationElements = await page.$$(req.body.paginationclass);
  
//     }
//     // const paginationElements = await page.$$(req.body.paginationclass);

//     if (req.body.paginationclass =="") {
//       // No pagination elements found, scrape data from a single page
//       const imageUrls = await page.$$eval(req.body.imgclass, images => {
//         return images.map(img => img.src);
//       });

//       const descp = await page.$$(req.body.descpclass);
//       const curr = await page.$$(req.body.currclass);
//       const elements = await page.$$(req.body.priceclass);

//       for (let i = 0; i < imageUrls.length; i++) {
//         const imageUrl = imageUrls[i];
//         const description = descp[i];
//         const priceElement = elements[i];
//         const currencyElement = curr[i];

//         if (!priceElement || !currencyElement || !description) {
//           console.log(`Skipping index ${i} due to missing elements.`);
//           continue;
//         }

//         const priceProperty = await priceElement.getProperty('textContent');
//         const currencyProperty = await currencyElement.getProperty('textContent');
//         const descriptionProperty = await description.getProperty('textContent');

//         const desc = await descriptionProperty.jsonValue();
//         const price = await priceProperty.jsonValue();
//         const currency = await currencyProperty.jsonValue();

//         data.push({
//           'description': desc,
//           'imageurl': imageUrl,
//           'price': price,
//           'currency': currency
//         });
//       }
//     } else {
//       // Pagination elements found, navigate through paginated pages
//       let pageCounter = 1;
//       let datacount = 0;

//       while (true) {
//         const currentPageURL = url+paginurltxt+pageCounter;
//         console.log(currentPageURL);
//         await page.goto(currentPageURL, { timeout: 0, waitUntil: 'domcontentloaded' });
//           await page.waitForTimeout(8000);
//           if(req.body.imgclass == null || req.body.imgclass == ""){
//             break;
//           }
//           const imgSelector = req.body.imgclass; // Replace with the selector for the <img> element
//     // await page.waitForSelector(imgSelector);
//     const checknextpagedata = await page.$$(req.body.descpclass);
//     if(checknextpagedata.length == 0 || checknextpagedata == null ){
//       datacount+=1;

//       console.log('Images selectors not found on the next page. Stopping program.');
//       if(datacount>=3){
//         break; // Exit the loop
        
//       }
//       continue;
//     }
//     datacount = 0;


//     const imgElem = await page.waitForSelector(imgSelector); // Adjust the timeout as needed

//     if (!imgElem) {
//       console.log('Image selector not found on the next page. Stopping program.');
//       break; // Exit the loop
//     }

//     // Add an event listener to the <img> element to check for the 'load' event
//     await page.evaluate((selector) => {
//       const imgElement = document.querySelector(selector);
//        new Promise((resolve) => {
//         imgElement.addEventListener('load', resolve);
//       });
//     }, imgSelector);
//          // await page.waitForSelector(req.body.imgclass);
//          await page.evaluate(() => {
//            window.scrollTo(0, document.body.scrollHeight);
//          });


//         // Your scraping logic here
//         const imageUrls = await page.$$eval(req.body.imgclass, images => {
//           return images.map(img => img.src);
//         });

//         const descp = await page.$$(req.body.descpclass);
//         const curr = await page.$$(req.body.currclass);
//         const elements = await page.$$(req.body.priceclass);
//         const nextpage = await page.$$(req.body.priceclass);

//         for (let i = 0; i < imageUrls.length; i++) {
//           const imageUrl = imageUrls[i];
//           const description = descp[i];
//           const priceElement = elements[i];
//           const currencyElement = curr[i];

//           if (!priceElement || !currencyElement || !description) {
//             console.log(`Skipping index ${i} due to missing elements.`);
//             continue;
//           }

//           const priceProperty = await priceElement.getProperty('textContent');
//           const currencyProperty = await currencyElement.getProperty('textContent');
//           const descriptionProperty = await description.getProperty('textContent');

//           const desc = await descriptionProperty.jsonValue();
//           const price = await priceProperty.jsonValue();
//           const currency = await currencyProperty.jsonValue();

//           data.push({
//             'description': desc,
//             'imageurl': imageUrl,
//             'price': price,
//             'currency': currency
//           });
//         }

//         // Check if there are no more pages to scrape
//         const hasNextPage = await page.$(req.body.paginationpageclass);
//         if (!hasNextPage || hasNextPage == "" || hasNextPage == null || imageUrls.length == 0 ) {
//           break;
//         }
//         console.log("I run");

//         pageCounter+=paginurlval;
//       }
//     }

//     console.log(data);

//     await page.close(); // Close the page
//     await browser.close();

//     res.status(200).json({
//       'status_code': 200,
//       'data': data,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       'status_code': 500,
//       'error': 'Internal server error',
//       'data':data,
//     });
//   }
// });
















