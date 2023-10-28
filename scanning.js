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


// const addingUrlData = [
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat7090034/Tecnologia",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/CATG10006/Automotriz",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
   // {
   //  "parentdivclass":".jsx-200723616.search-results-4-grid.grid-pod",
   //    "url": "https://www.falabella.com/falabella-cl/category/cat2038/Fotografia",
   //    "imgclass": ".jsx-1996933093",
   //    "descpclass": ".pod-subTitle.subTitle-rebrand",
   //    "currclass": ".copy10.primary.medium.jsx-2490421794",
   //    "priceclass": ".copy10.primary.medium.jsx-2490421794",
   //    "paginationpageclass": ".pagination-button-mkp",
   //    "paginationurltxt": "?page=",
   //    "paginationurlvalue": 1
   //  },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat16400010/Telefonia",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat16510006/Electrohogar",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat1008/Muebles",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat1005/Dormitorio",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat01/Cocina-y-Bano",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat2026/Decoracion-e-iluminacion",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/CATG10011/Jardin-y-terraza",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/page/tienda-de-deporte",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat7330051/Mujer",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat13550007/Ninos-y-Jugueteria",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat7450065/Hombre",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat2008/Mundo-Bebe?isLanding=false",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/collection/ver-todo-calzado",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/cat8620074/Herramientas-y-maquinas",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/CATG10005/Construccion-y-ferreteria",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/CATG11449/Papeleria-y-Articulos-de-escritorio?isPLP=1",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.falabella.com/falabella-cl/category/CATG34913/Maleteria-y-viajes",
    //   "imgclass": ".jsx-1996933093",
    //   "descpclass": ".pod-subTitle",
    //   "currclass": ".copy10",
    //   "priceclass": ".copy10",
    //   "paginationpageclass": ".pagination-button-mkp",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.paris.cl/moda-circular/ropa-usada/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/search?pmid=evento-producto-conciencia-celeste-moda",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/moda-circular/marcas-destacadas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/experiencias-y-servicios/spa-y-belleza/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/regalos/ideas-de-regalos/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/experiencias-y-servicios/gift-cards/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/mascotas/servicios-para-mascotas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/experiencias-y-servicios/salud-y-fitness/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/experiencias-y-servicios/cursos-y-talleres/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/experiencias-y-servicios/actividades-recreativas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/experiencias-y-servicios/membresias-y-suscripciones/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/regalos/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/electro/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/tecnologia/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/dormitorio/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/muebles/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/linea-blanca/refrigeracion/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/linea-blanca/climatizacion/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/linea-blanca/lavado-secado/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/linea-blanca/estufas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/belleza/cuidado-personal/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/linea-blanca/electrodomesticos/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "parentdivclass":".tw-flex-col.tw-p-0px",
    //   "url": "https://www.paris.cl/tecnologia/celulares/",
    //   "imgclass": ".tw-object-contain.tw-w-full.tw-h-full",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".tw-text-common-default.tw-text-h3.tw-font-montserrat",
    //   "priceclass": ".tw-text-common-default.tw-text-h3.tw-font-montserrat",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },

            

            
            
            
            
            
            
            
            
    // {
    //   "url": "https://www.paris.cl/linea-blanca/marcas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/linea-blanca/equipamiento-industrial/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/decohogar/decoracion/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/decohogar/iluminacion/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/decohogar/marcas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/decohogar/menaje-cocina/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/decohogar/organizacion/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/decohogar/decoracion/cortinas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/decohogar/menaje-mesa/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/decohogar/maleteria/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/decohogar/alfombras/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/decohogar/bano/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/mujer/moda/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/mujer/marcas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/zapatos/mujer/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/mujer/novedades/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/mujer/accesorios-moda/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/mujer/colecciones/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/mujer/ofertas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/mujer/ultimas-unidades/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/hombre/moda/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/hombre/ropa-interior/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/hombre/accesorios/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/hombre/ofertas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/zapatos/hombre/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/hombre/novedades/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/hombre/marcas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/hombre/cuidado-personal/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/belleza/perfumes/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/belleza/dermocosmetica/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/belleza/maquillaje/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/belleza/wellness/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/belleza/cuidado-tratamiento/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/belleza/marcas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/belleza/novedades/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/belleza/cuidado-personal/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/belleza/cuidado-personal-hombre/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/belleza/sets-regalo/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/zapatos/mujer/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/zapatos/hombre/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/zapatos/marcas-hombre/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/zapatos/ninos/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/zapatos/marcas-zapatillas-deportivas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/zapatos/zapatillas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/outlet/outlet-zapatos-y-zapatillas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/zapatos/tendencias/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/deportes/bicicletas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/deportes/fitness/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/deportes/outdoor/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/deportes/camping/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/deportes/hombre/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/deportes/especificos/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/deportes/mujer/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/deportes/marcas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/deportes/ofertas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/deportes/aire-libre/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/deportes/ninos/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/zapatos/zapatillas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/ninos/mundo-bebes/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/ninos/mundo-bebe/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/ninos/coches/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/ninos/moda/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/ninos/sillas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/ninos/novedades/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/ninos/dormitorio/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/ninos/zapatos/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/ninos/marcas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jugueteria/juegos-de-exterior/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jugueteria/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/ninos/oportunidades/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jardinterraza/parrillas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jugueteria/juegos-de-exterior/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/muebles/terrazas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jardinterraza/jardin/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jardinterraza/accesorios-herramientas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jugueteria/munecas-peluches/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jugueteria/juegos-de-exterior/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jugueteria/autos-radiocontrolados/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/tecnologia/consolas-videojuegos/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jugueteria/figuras-juegos-accion/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jugueteria/?prefn1=infantilRangoEdad&prefv1=0-2%20a%C3%B1os%7C3-5%20a%C3%B1os%7C6-9%20a%C3%B1os%7C10-13%20a%C3%B1os%7C%2B14%20a%C3%B1os",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jugueteria/didacticos-recreativos/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/juguetes/marcas/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/juguetes/novedades/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/jugueteria/juguetes-coleccionables/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/outlet/outlet-juguetes/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://www.paris.cl/outlet/outlet-juguetes/",
    //   "imgclass": ".tw-object-contain",
    //   "descpclass": ".perseo-item-title",
    //   "currclass": ".perseo-item-title",
    //   "priceclass": ".perseo-item-title",
    //   "paginationpageclass": ".paginator__number",
    //   "paginationurltxt": "?start=",
    //   "paginationurlvalue": 24
    // },
    // {
    //   "url": "https://simple.ripley.cl/tecno?source=menu&s=mdco",
    //   "imgclass": ".images-preview-item is-previous",
    //   "descpclass": ".catalog-product-details__name",
    //   "currclass": ".catalog-prices__offer-price",
    //   "priceclass": ".catalog-prices__offer-price",
    //   "paginationpageclass": ".pagination",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://simple.ripley.cl/belleza?source=menu&s=mdco",
    //   "imgclass": ".images-preview-item is-previous",
    //   "descpclass": ".catalog-product-details__name",
    //   "currclass": ".catalog-prices__offer-price",
    //   "priceclass": ".catalog-prices__offer-price",
    //   "paginationpageclass": ".pagination",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://simple.ripley.cl/accesorios-y-complementos?source=menu&s=mdco",
    //   "imgclass": ".images-preview-item is-previous",
    //   "descpclass": ".catalog-product-details__name",
    //   "currclass": ".catalog-prices__offer-price",
    //   "priceclass": ".catalog-prices__offer-price",
    //   "paginationpageclass": ".pagination",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://simple.ripley.cl/automotriz?source=menu&s=mdco",
    //   "imgclass": ".images-preview-item is-previous",
    //   "descpclass": ".catalog-product-details__name",
    //   "currclass": ".catalog-prices__offer-price",
    //   "priceclass": ".catalog-prices__offer-price",
    //   "paginationpageclass": ".pagination",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://simple.ripley.cl/moda-hombre?source=menu&s=mdco",
    //   "imgclass": ".images-preview-item is-previous",
    //   "descpclass": ".catalog-product-details__name",
    //   "currclass": ".catalog-prices__offer-price",
    //   "priceclass": ".catalog-prices__offer-price",
    //   "paginationpageclass": ".pagination",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://simple.ripley.cl/moda-infantil?source=menu&s=mdco",
    //   "imgclass": ".images-preview-item is-previous",
    //   "descpclass": ".catalog-product-details__name",
    //   "currclass": ".catalog-prices__offer-price",
    //   "priceclass": ".catalog-prices__offer-price",
    //   "paginationpageclass": ".pagination",
    //   "paginationurltxt": "?page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.corona.cl/moda/hombre?initialMap=c,c&initialQuery=moda/hombre&map=category-1,category-2,linea,linea&order=OrderByReleaseDateDESC&query=/moda/hombre/jeans/vestuario&searchState",
    //   "imgclass": ".vtex-product-summary-2-x-imageNormal vtex-product-summary-2-x-image",
    //   "descpclass": ".vtex-product-summary-2-x-productBrand vtex-product-summary-2-x-brandName t-body",
    //   "currclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "priceclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "paginationpageclass": ".pagination__link--active",
    //   "paginationurltxt": "&page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.corona.cl/moda/mujer?initialMap=c,c&initialQuery=moda/mujer&map=category-1,category-2,linea,linea&order=OrderByReleaseDateDESC&query=/moda/mujer/jeans/vestuario&searchState",
    //   "imgclass": ".vtex-product-summary-2-x-imageNormal vtex-product-summary-2-x-image",
    //   "descpclass": ".vtex-product-summary-2-x-productBrand vtex-product-summary-2-x-brandName t-body",
    //   "currclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "priceclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "paginationpageclass": ".pagination__link--active",
    //   "paginationurltxt": "&page=",
    //   "paginationurlvalue": 1
    // },
    //
    //
    // {
    //   "url": "https://www.corona.cl/moda/infantil?initialMap=c,c&initialQuery=moda/infantil&map=category-1,category-2&order=OrderByReleaseDateDESC&query=/moda/infantil&searchState",
    //   "imgclass": ".vtex-product-summary-2-x-imageNormal vtex-product-summary-2-x-image",
    //   "descpclass": ".vtex-product-summary-2-x-productBrand vtex-product-summary-2-x-brandName t-body",
    //   "currclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "priceclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "paginationpageclass": ".pagination__link--active",
    //   "paginationurltxt": "&page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.corona.cl/moda?initialMap=c&initialQuery=moda&map=category-1,linea,mundo&order=OrderByReleaseDateDESC&query=/moda/deportes/deportivo&searchState",
    //   "imgclass": ".vtex-product-summary-2-x-imageNormal vtex-product-summary-2-x-image",
    //   "descpclass": ".vtex-product-summary-2-x-productBrand vtex-product-summary-2-x-brandName t-body",
    //   "currclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "priceclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "paginationpageclass": ".pagination__link--active",
    //   "paginationurltxt": "&page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.corona.cl/moda/?initialMap=c&initialQuery=moda&map=category-1,linea&order=OrderByReleaseDateDESC&query=/moda/calzado&searchState",
    //   "imgclass": ".vtex-product-summary-2-x-imageNormal vtex-product-summary-2-x-image",
    //   "descpclass": ".vtex-product-summary-2-x-productBrand vtex-product-summary-2-x-brandName t-body",
    //   "currclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "priceclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "paginationpageclass": ".pagination__link--active",
    //   "paginationurltxt": "&page=",
    //   "paginationurlvalue": 1
    // },
    //
    //
    // {
    //   "url": "https://www.corona.cl/moda?initialMap=c&initialQuery=moda&map=category-1,linea,mundo&order=OrderByReleaseDateDESC&query=/moda/deportes/outdoor&searchState",
    //   "imgclass": ".vtex-product-summary-2-x-imageNormal vtex-product-summary-2-x-image",
    //   "descpclass": ".vtex-product-summary-2-x-productBrand vtex-product-summary-2-x-brandName t-body",
    //   "currclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "priceclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "paginationpageclass": ".pagination__link--active",
    //   "paginationurltxt": "&page=",
    //   "paginationurlvalue": 1
    // },
    // {
    //   "url": "https://www.corona.cl/lippi?_q=lippi&map=ft&order=OrderByTopSaleDESC",
    //   "imgclass": ".vtex-product-summary-2-x-imageNormal vtex-product-summary-2-x-image",
    //   "descpclass": ".vtex-product-summary-2-x-productBrand vtex-product-summary-2-x-brandName t-body",
    //   "currclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "priceclass": ".corona-quick-view-0-x-containerSellingPriceRedPLP",
    //   "paginationpageclass": ".pagination__link--active",
    //   "paginationurltxt": "&page=",
    //   "paginationurlvalue": 1
    // },

  // ];
// setWebsiteData();
var count = 0;
const dataArray = [];
var countDiscountMessage = 0;
var codToke  = ""; 

var minprice  = 0; 
let discountpercentagee = 0;
getWebsiteData();
setInterval(getWebsiteData, 4 * 60 * 60 * 1000);


async function getWebsiteData() {
if(count == dataArray.length){
  count = 0;
  dataArray.length = 0;
}else{
  // count = 0;
  // dataArray.length = 0;
  return;
}

try {
    const snapshott = await db.collection("tokens").get();

    // snapshott.forEach((doc) => {
      const tokendata = snapshott.docs[0].data();
      codToke = tokendata['token'];
      minprice = tokendata['minprice'];
      discountpercentagee = tokendata['discountpercentage'];
      // dataArray.push(data);
    // });

    // console.log(dataArray); // This will print the array with your Firestore collection data

    // Assuming setWebsiteData is an asynchronous function
    // await setWebsiteData(dataArray);
  } catch (error) {
    console.error('Error getting documents:', error);
  }

  try {
    const snapshot = await db.collection("websitedata").get();

    snapshot.forEach((doc) => {
      const data = doc.data();
      dataArray.push(data);
    });

    console.log(dataArray); // This will print the array with your Firestore collection data

    // Assuming setWebsiteData is an asynchronous function
    await setWebsiteData(dataArray);
  } catch (error) {
    console.error('Error getting documents:', error);
  }
}
async function setWebsiteData(addingUrlData) {
  console.log("Added Data Displayed:" + addingUrlData[0]['url'].toString());
  realUrl = addingUrlData[0]['url'].toString();

  for (let i = 0; i < addingUrlData.length; i++) {
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
  }
}
// const db = admin.firestore();
// const data = {
//   name: 'John Doe',
//   email: 'johndoe@example.com',
//   age: 30
// };  
// const docRef = db.collection('products').add(data)
//   .then(docRef => {
//     console.log('Document written with ID: ', docRef.id);
//   })
//   .catch(error => {
//     console.error('Error adding document: ', error);
//   });

// Add a new document with a generated ID to a collection
async function scrapeWebsiteUrl(parentdivclass,producturlclass,urls,imgclass,descpclass,currclass,priceclass,paginationpageclass,paginationurltxt,paginationurlvalue) {
   console.log('Received a POST request to /v1/sendbotdata');
  // console.log(req.body); // Log the request body
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
    // const paginationElements = await page.$$(req.body.paginationclass);

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
    // await page.waitForSelector(imgSelector);
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
         // await page.waitForSelector(req.body.imgclass);
//          await page.evaluate(() => {
//            window.scrollTo(0, document.body.scrollHeight);
//          });
//          await page.waitForTimeout(10000);


//         // Your scraping logic here
//        await page.evaluate(() => {
//   window.scrollTo(0, document.body.scrollHeight);
// });
const scrollStep = 280; // The number of pixels to scroll in each step
const scrollInterval = 1000; // The time interval (in milliseconds) between each step
var imageUrl = "";
// await page.waitForTimeout(5000); 
 const maxScrollHeight = await page.evaluate(() => document.body.scrollHeight);
  let currentScrollHeight = 0;

  while (currentScrollHeight < maxScrollHeight) {
    await page.evaluate((scrollStep) => {
      window.scrollBy(0, scrollStep);
    }, scrollStep);

    await page.waitForTimeout(scrollInterval);
    currentScrollHeight += scrollStep;
  }
// const imageUrls =await page.$$eval(imgclass, images => images.map(img => img.src));
// Collect image URLs
await page.waitForTimeout(5000); 
await page.waitForSelector(imgclass);
const imageUrlss = await page.$$eval(imgclass, (images) => {
  return images.map((img) => img.getAttribute('src'));
});

        // const descp = await page.$$(descpclass);
        // const curr = await page.$$(currclass);
        // const elements = await page.$$(priceclass);
        // const nextpage = await page.$$(priceclass);
//         const [descp, curr, elements, nextpage] = await Promise.all([
//   page.$$(descpclass),
//   page.$$(currclass+':first-child'),
//   page.$$(priceclass+':first-child'), 
//   page.$$(priceclass+':first-child'),  // I assume you meant "nextpageclass" here

// ]);
// const parentDivClass = ".tw-flex-col.tw-p-0px"; // Replace with the actual class name of the parent div

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
 
  // console.log("Image Details:"+imageElements.toString());
  // console.log("Length of Desc:"+descElements.length.toString() );
  // console.log("Length of Image:"+imageElements.length.toString() );
  // console.log("Length of Price:"+priceElements.length.toString() );
 
    
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

      // console.log({
      //       'description': descText,
      //       'imageurl': imageUrl,
      //       'price': priceText,
      //       'currency': priceText,
      //       'websiteurl':currentPageURL
      //     });
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
          
          // console.log({
          //   'description': descText,
          //   'imageurl': imageUrl,
          //   'price': priceText,
          //   'currency': priceText,
          //   'websiteurl':currentPageURL
          // });
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

         // console.log("imageUrls: "+imageUrls.length);
         // console.log("Descp: "+descp.length);
         // console.log("Currency: "+curr.length);
         // console.log("price: "+elements.length);
         //  console.log("price: "+nextpage.length);
         //  console.log(imageUrls);

        // for (let i = 0; i < descp.length; i++) {
          
        //   // if (imageUrls[i].includes(',')) {


        //   //    // The string contains a comma, so we split and trim it
        //   //    console.log(imageUrls[i]);
        //   //    const urlList = imageUrls[i].split(',').map(url => url.trim());

        //   //    imageUrls[i] = urlList[1];
        //   // } else {
        //   //   // The string doesn't contain a comma, so it's a single URL
        //   //   console.log('Only one URL found:');
        //   //  // imageUrl = imageUrls[i];
        //   // }

        //   const desc = await descp[i].evaluate((element) => element.textContent);
        //   const price = await elements[i].evaluate((element) => element.textContent);
        //   const currency = await curr[i].evaluate((element) => element.textContent);

        //   // if (!priceElement || !currencyElement || !description) {
        //   //   console.log(`Skipping index ${i} due to missing elements.`);
        //   //   continue;
        //   // }

        //   // const priceProperty = await priceElement.getProperty('textContent');
        //   // const currencyProperty = await currencyElement.getProperty('textContent');
        //   // const descriptionProperty = await description.getProperty('textContent');

        //   // const desc = await descriptionProperty.jsonValue();
        //   // const price = await priceProperty.jsonValue();
        //   // const currency = await currencyProperty.jsonValue();
        //   console.log({
        //     'description': desc,
        //     'imageurl': imageUrls[i],
        //     'price': price,
        //     'currency': currency,
        //     'websiteurl':currentPageURL
        //   });

        //   data.push({
        //     'description': desc,
        //     'imageurl': imageUrls[i],
        //     'price': price,
        //     'currency': currency,
        //     'websiteurl':currentPageURL
        //   });
        // }

        // Check if there are no more pages to scrape
        const hasNextPage = await page.$(paginationpageclass);
        // if (!hasNextPage || hasNextPage == "" || hasNextPage == null || imageUrls.length == 0 ) {
        //   break;
        // }
        console.log("I run");
        console.log("Data Length:"+data.length.toString());

        pageCounter+=paginurlval;
        
      }
    }


    await page.close(); // Close the page
    await browser.close();
    await SaveProducts(data,currentPageURL);    
    // res.status(200).json({
    //   'status_code': 200,
    //   'data': data,
    // });
  } catch (error) {
    console.log("Something is going wrong");
    console.error(error);
    await SaveProducts(data,currentPageURL);
    // res.status(500).json({
    //   'status_code': 500,
    //   'error': 'Internal server error',
    //   'data':data,
    // });
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
  
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

try {
    const snapshott = await db.collection("tokens").get();

    // snapshott.forEach((doc) => {
      const tokendata = snapshott.docs[0].data();
      codToke = tokendata['token'];
      minprice = tokendata['minprice'];
      discountpercentagee = tokendata['discountpercentage'];

      // dataArray.push(data);
    // });

    // console.log(dataArray); // This will print the array with your Firestore collection data

    // Assuming setWebsiteData is an asynchronous function
    // await setWebsiteData(dataArray);
  } catch (error) {
    console.error('Error getting token:', error);
  }
  // console.log('Product Data: ' + JSON.stringify(productData));
  console.log('Save product data length: ' + productData.length.toString());

  for (let i = 0; i < productData.length; i++) {
    console.log('Firestore Index: ' + i);
    setTimeout(() => {
    
    }, 2000);

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
      const match = regExp.exec(snapshot.docs[0].data().newprice.toString());

      newprice = match ? parseFloat(match[0]) : 0.0;

      const matchPrice = regExp.exec(productData[i].price.toString());
      price = matchPrice ? parseFloat(matchPrice[0]) : 0.0;

      const matchOldPrice = regExp.exec(snapshot.docs[0].data().oldprice.toString());
      oldprice = matchOldPrice ? parseFloat(matchOldPrice[0]) : 0.0;

      console.log('Product Description is: ' + snapshot.docs[0].data().productdescp);
      if (snapshot.docs[0].data().productdescp === productData[i].description &&
        newprice !== 0 &&
        newprice !== price
      ) {
        console.log('New Price changed');
        discountprice = newprice - price;
        // if (discountprice < 0) {
        //   discountprice = -discountprice;
        // }

        discountpercent = parseInt((discountprice / newprice) * 100);
        console.log('Id of Product: ' + snapshot.docs[0].id);

        await db.collection('products').doc(snapshot.docs[0].id).update({
          oldprice: snapshot.docs[0].data().newprice.toString(),
          oldpricedate: snapshot.docs[0].data().newpricedate.toDate(),
          newprice: productData[i].price.toString(),
          newpricedate: new Date(),
          dicountpercentage: discountpercent,

        });
        if(discountpercent >= discountpercentagee && price > minprice ){

            sendDataInEmail.push({
              image: productData[i].imageurl,
              description: productData[i].description,
              producturl:productData[i].producturl,
              oldprice: snapshot.docs[0].data().newprice,
              oldpricedate:dateFormatter.format(snapshot.docs[0].data().newpricedate.toDate()),
              newprice: productData[i].price,
              newpricedate:dateFormatter.format(new Date()),
              dicountpercentage: discountpercent,
              websiteurl: productData[i].websiteurl,
            });  
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
      description: `- New Price: ${data.newprice}\n`
        + `- New Price Date: ${data.newpricedate}\n`
        + `- Old Price: ${data.oldprice}\n`
        + `- Old Price Date: ${data.oldpricedate}\n`
        + `- Discount Percentage: ${data.dicountpercentage}%\n\nCategory URL: ${data.websiteurl}\n\nProduct URL: ${data.producturl}`,
      // image: { url: data.image },
    };

     }else{
      embed = {
      title: data.description,
      description: `- New Price: ${data.newprice}\n`
        + `- New Price Date: ${data.newpricedate}\n`
        + `- Old Price: ${data.oldprice}\n`
        + `- Old Price Date: ${data.oldpricedate}\n`
        + `- Discount Percentage: ${data.dicountpercentage}%\n\nCategory URL: ${data.websiteurl}\n\nProduct URL: ${data.producturl}`,
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


// app.post('/v1/sendbotdata', async (req, res) => {
 
// });

































