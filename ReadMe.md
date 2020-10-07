# Creating CommandLine Interfaces using Node.js

The commandline or the terminal is a powerful tool used by a lot of developers. It allows us to interact with the operating system using commands passed as input strings of text. A lot of tools used by developers have a terminal CLI or commandline interface to acompany the product. Using the commandline is easy and direct hence why a lot of people prefer using it.

Creating a CLI application is not a difficult task and this advantage has helped make them more popular.

Some of the most popular commandline interface applications are project generators like [create-react-app](https://www.npmjs.com/package/create-react-app) for generating React.js application boilerplate, [angular CLI](https://www.npmjs.com/package/@angular/cli) for creating an Angular.js project and [Vue CLI](https://www.npmjs.com/package/@vue/cli) for Vue.js applications.

The above examples are a bit more complex in functionality and can be confusing. However, the basics are still the same. One thing all of the above have in common is that they are all made using Node.js.

Getting started with CLI appplications using Node.Js couldn't be easier. To tackle the basics, lets create a simple CLI application that takes 2 arguments `joke` or `quote` and generates a joke or a quote.

## The Shebang

First things first, the starting point of any CLI application point is a line called the Shebang.
In Node.js the shebang looks something like this:

```javascript
#!/usr/bin/env node

```

The shebang basically tells the operating system what type of code is contained in the script and what interpretor it should asign to the script. If it was a python script, it would look something like this:

```python
#!/usr/bin/env py
```

The shebang however, is only applicable in Unix/Linux operating systems, or the Windows Linux Subsystem.
It should always be specified as the first line of the entry file.

### Project Setup

To get started, lets setup our project and Node.js environment. In the terminal, enter:

```terminal
mkdir node-cli
cd node-cli
npm init -y
```

NOTE: passing the `-y` flag to npm init, will instantiate a new npm project and set everything to default and yes.

This will generate our package.json file.

Next up lets install all the packages we will make use of in the project.
We will make use of the following:

- [axios](https://www.npmjs.com/package/axios) for making our network requests.
- [chalk](https://www.npmjs.com/package/chalk) for making our user interface better looking and stylish.
- [yargs](https://www.npmjs.com/package/yargs) for all our options and argument parsing.

Let's go ahead and install them:

```terminal
    npm i axios chalk yargs
```

Your package.json file should now looks like this:

```javascript
{
  "name": "Section",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^0.20.0",
    "chalk": "^4.1.0",
    "yargs": "^16.0.3"
  }
}
```

### Getting the jokes and quotes

Lets setup the jokes and quotes. We will be using a [quote-generator-api](https://quotes.rest/) and [jokes-generator-api](https://official-joke-api.appspot.com/). We will fetch the individual jokes and display them on the terminal when the user asks for them.

We will create two functions that will do the fetching using axios.

```javascript
#!/usr/bin/env node

const axios = require("axios");
const chalk = require("chalk");

let url = "";

function getJoke() {
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
      console.log(log);
    })
    .catch((err) => {
      const log = chalk.red(err);
      console.log(log);
    });
}
```

Note: We are using chalk to color our logs to get a nice feel and a colorful output. We setup an empty string called url so that when the user selects quotes, we load in the quote api url and same goes for jokes.

The code at the moment will not work because we are not calling any of the methods anywhere.

## Understanding option/command/argument parsing

A good example of option parsing is when we passed _-y_ to our _npm init_ command to set everything to default.
The commands used in CLI applications are often accompanied with other options or flags that extend the functionality of the application like in the example above.
A common application of options is when asking for user input that determines the output of the application.

Node.js comes with an inbuilt app interface for the process module called **process.argv**. It takes in the arguments passed, invokes a methods and returns an array with all the arguments passed into the main process.

However using _process.arg_ might be tedious and not beginner friendly. Subsequently we will use [yargs](https://www.npmjs.com/package/yargs) to help us process the options.

Yargs offers a lot of options that make it very powerful and widely used. Some of them include `.command()`, `.help()`, `.example()`, `.usage()` and others. To read more on the different capabilities of the options in the yargs [docs](https://github.com/yargs/yargs).

We will be making use of the command option to allow us to invoke a function when the set command is triggered. The syntax for this is:

```javascript
const argv = require("yargs");
argv.command(
  "name of command",
  "description of the command",
  functionA,
  functionB
).argv;
```

Note: _functionA_ will define the command arguments, then _functionB_ will implement the function.

In our project we need two commands, let's set them up

```javascript
const argv = require("yargs");
argv.command(
  "joke",
  "Fetching your joke",
  (yargs) => {},
  (argv) => {}
).argv;

argv.command(
  "quote",
  "Fetching a quote",
  (yargs) => {},
  (argv) => {}
).argv;
```

Finally, let's pass in our functions to enable the jokes and quotes to be displayed.

```javascript
const argv = require("yargs");
argv.command(
  "joke",
  "Fetching your joke",
  (yargs) => {},
  (argv) => {
    getJoke();
  }
).argv;

argv.command(
  "quote",
  "Fetching a quote",
  (yargs) => {},
  (argv) => {
    getQuotes();
  }
).argv;
```

To run the project, in the terminal type:

To get a joke run:

```terminal
node index.js joke
```

To get a quote run:

```terminal
node index.js quote
```

## Finishing Up

Our full code now looks like this:

```javascript
const axios = require("axios");
const chalk = require("chalk");
const argv = require("yargs");

let url = "";
argv.command(
  "joke",
  "Fetching your joke",
  (yargs) => {},
  (argv) => {
    getJoke();
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

function getJoke() {
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
     const quote = chalk.cyan(res.data.contents.quotes[0].quote);
      const author = chalk.green(res.data.contents.quotes[0].author);
      console.log(`${quote} - ${author}`);
    })
    .catch((err) => {
      const log = chalk.red(err);
      console.log(log);
    });
}
argv.help();

```

we added the help command to provide a default ```--help/help``` flag to give application options.

### Conclussion

In this article we went through how to setup a CLI script using Node.js, we also went through what the shebang is and why it is important in CLI applicaitons, and finally learned how to pass arguments and commands to the application. As a bonus, we used chalk to make out outputs looks nice and presentable.

The code for the article can be found [here](https://github.com/katungi/Node-CLI-Section)

