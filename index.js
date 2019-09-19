const express = require('express');
const https = require('https');
var fs = require('fs');

const app = express();

// Number to start download lesson from
let lessonNum = 1;

// Create target folder
const dir = './Redux Saga';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Run download
function run() {
  
  const options = {
    hostname: 'vs1.coursehunter.net',
    port: 443,
    path: `/pluralsight-redux-saga/lesson${lessonNum}.mp4`,
    method: 'GET',
    headers: {
      'Content-Type': 'video/mp4'
    }
  };

  const req = https.request(options, res => {

    if (res.statusCode === 404) {
      console.log('Dowloading finished!');
      return;
    }

    console.log(`statusCode: ${res.statusCode}`);
    console.log(`Lesson number ${lessonNum} is processing`);
    const writeStream = fs.createWriteStream(`./${dir}/lesson${lessonNum}.mp4`);

    res.on('data', chunk => {
      writeStream.write(chunk);
    });

    res.on('end', () => {
      lessonNum++;
      run();
    });
  });

  req.on('error', error => {
    console.error(error);
  });

  req.end();
}

run();

app.listen(3000, () => console.log('Listening 3000'));
