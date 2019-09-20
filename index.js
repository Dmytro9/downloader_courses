const express = require('express');
const https = require('https');
var fs = require('fs');
const cheerio = require('cheerio');

const app = express();

// Create target folder
const dir = './Web Scraping в Nodejs';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Start lesson
let lessonNum = 123;
// Lessons names
let lessonNames = [];

function fetchVideo() {

  const options = {
    hostname: 'vs3.coursehunter.net',
    port: 443,
    path: `/udemy-wsinjsc/lesson${lessonNum}.mp4`,
    method: 'GET',
    headers: {
      'Content-Type': 'video/mp4'
    }
  };

  const req = https.request(options, res => {
    console.log('responce status', res.statusCode)
    if (res.statusCode === 404) {
      console.log('Dowloading finished!');
      process.exit(0);
    }

    console.log(`Lesson "${lessonNum} ${lessonNames[lessonNum-1]}" is processing`);

    const writeStream =  fs.createWriteStream(`./${dir}/${lessonNum} ${lessonNames[lessonNum-1]}.mp4`);

    res.on('data', chunk => {
      writeStream.write(chunk);
    });

    res.on('end', () => {
      lessonNum++;
      fetchVideo();
    });

  });

  req.on('error', error => {
    console.error(error);
  });

  req.end();
}

function fetchHtml() {
  let html = '';
  const options = {
    hostname: 'coursehunter.net',
    port: 443,
    path: `/course/web-scraping-v-nodejs`,
    method: 'GET',
    headers: {
      'Content-Type': 'text/html'
    }
  }; 

  const req = https.request(options, res => {

    if (res.statusCode === 404) {
      console.log('Something went wrong!');
      return;
    }

    res.on('data', chunk => {
      html += chunk;
    });

    res.on('end', async () => {
      const regex = /\//;
      const $ = await cheerio.load(html);
      $('#lessons-list .lessons-name').each((i, element) => {
        lessonNames.push($(element).text().replace(regex, ' '));
      });
      fetchVideo();
    });

  });

  req.on('error', error => {
    console.error(error);
  });

  req.end();
};

fetchHtml();


app.listen(3000, () => console.log('Listening 3000'));
