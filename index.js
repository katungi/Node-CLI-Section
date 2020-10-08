#!/usr/bin/env node

const axios = require("axios");
const chalk = require("chalk");
const argv = require("yargs");
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');

const client = new textToSpeech.TextToSpeechClient();
let url = "";
argv.command(
  "joke",
  "Fetching your joke",
  (yargs) => {},
  (argv) => {
    getJokes();
  }
).argv;

argv.command(
  "quote",
  "Fetching a quote",
  (yargs) => {},
  (argv) => {
      getQuote();
  }
).argv;

function getJokes() {
  url = "https://official-joke-api.appspot.com/random_joke";
  axios({
    method: "get",
    url: url,
  })
    .then((res) => {
      const setup = chalk.cyan(res.data.setup);
      const punchline = chalk.green(res.data.punchline);
      const log = `${setup} - ${punchline}`
      console.log(log);
      quickStart(log);
    })
    .catch((err) => {
      const log = chalk.red(err);
      console.log(log);
    });
}

function getQuote() {
  url = "https://quotes.rest/qod";
  axios({
    method: "get",
    url: url,
    headers: { Accept: "application/json" },
  })
    .then((res) => {
      const quote = chalk.cyan(res.data.contents.quotes[0].quote);
      const author = chalk.green(res.data.contents.quotes[0].author);
      const log = `${quote} - ${author}`;
      console.log(log);
      quickStart(log);

    })
    .catch((err) => {
      const log = chalk.red(err);
      console.log(log);
    });
}
argv.help();

async function quickStart(text) {
  const request = {
    input: {text: text},
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    audioConfig: {audioEncoding: 'MP3'},
  };
  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');
}
 
