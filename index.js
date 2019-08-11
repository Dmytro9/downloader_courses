const express = require('express');
const https = require('https');
var fs = require('fs');
// const path = require('path');

const app = express();

// Number to start download lesson from
let lessonNum = 1;

// Create target folder
const dir = './SQL_Intro';
// const dir = `${__dirname}/asx`
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Run download
function run() {
  console.log(`Lesson number ${lessonNum} is processing`);

  const options = {
    hostname: 'vs1.coursehunter.net',
    port: 443,
    path: `/fm-intro-to-sql-live-event/lesson${lessonNum}.webm`,
    method: 'GET',
    headers: {
      'Content-Type': 'video/webm'
    }
  };

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    if (res.statusCode === 404) {
      console.log('Dowloading finished!');
      return;
    }

    const writeStream = fs.createWriteStream(`./${dir}/lesson${lessonNum}.webm`);

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
// console.log('__dirname (the directory of the script file): ', __dirname);
// console.log(path.join(__dirname + '/foo', 'bar', 'baz/asdf/', 'quux', '..'))
run();

app.listen(3000, () => console.log('Listening 3000'));
