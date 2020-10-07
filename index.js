#!/usr/bin/env node

const axios = require("axios");
const chalk = require("chalk");
const argv = require("yargs");

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
      console.log(`${setup} - ${punchline}`);
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
      const quote = res.data.contents.quotes[0].quote;
      const author = res.data.contents.quotes[0].author;
      const log = chalk.cyan(`${quote} - ${author}`);
      isFetching = false;
      console.log(log);
    })
    .catch((err) => {
      const log = chalk.red(err);
      console.log(log);
    });
}
argv.help();
