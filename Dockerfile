FROM ghcr.io/puppeteer/puppeteer:21.2.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

<<<<<<< HEAD

=======
>>>>>>> fa73fda788cb0786002806f6b71b3030c5549b16
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
<<<<<<< HEAD
CMD ["node", "scanning.js"]    
=======
CMD ["node", "scanning.js"]  
>>>>>>> fa73fda788cb0786002806f6b71b3030c5549b16
