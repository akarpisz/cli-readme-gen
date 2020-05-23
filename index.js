#!/usr/bin/env node

const { prompt } = require("inquirer");
const { promisify } = require("util");
const child = require("child_process");
const fs = require("fs");

// const promptAsync = promisify(prompt);

const questions = [
  {
    name: "projectTitle",
    message: "Project Title?",
    default: "AwesomeProject",
  },
  {
    name: "description",
    message: "Write a brief description",
    default: "A project that does stuff.",
  },
  {
    name: "installation",
    message: "Installation:",
    default: "npm install",
  },
  {
    name: "usage",
    message: "Describe your project's use:",
  },
  {
    name: "license",
    message: "License Type:",
    default: "MIT",
  },
  {
    name: "contributors",
    message: "Contributors",
  },
  {
    name: "tests",
    message: "Test Commands:",
  },
  {
    name: "githubPic",
    message: "Github Picture:",
  },
  {
    name: "githubEmail",
    message: "Github Email:",
  },
];
let mainAns;
let repo;

async function main() {
  const mainQuestions = await prompt(questions);
  mainAns = mainQuestions;
}
const getRepo = () => {
  child.exec("git config --get remote.origin.url", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    } else {
      repo = stdout;
      console.log(repo);
    }
  });
};
const tableQuestion = [
  {
    type: "confirm",
    name: "includeTOC",
    message: "Include a table of contents? (Recommended)",
  },
];
const tableHeading = () => {
  let ans = prompt([
    {
      name: "tocHeading",
      message: "Enter a Table of Contents heading:",
    },
  ]);

  return ans;
};
const moreHeading = () => {
  let ans = prompt([
    {
      type: "confirm",
      name: "addHeadingQuestion",
      message: "Add another heading?",
      // choices: ["Yes", "No"]
    },
  ]);
  return ans;
};

const fillTable = async () => {
  try {
    let cont = [];
    

    for (let i = 0; i < tocList.length; i++) {
      let ans = await prompt([
        {
          name: `${tocList[i]}`,
          message: `add content about ${tocList[i]}`,
        },
      ]);
      cont.push(Object.values(ans).join(""));
      console.log(cont);
;      
    }
    
    let done = tocList.map((value, index) => { 
      return `${value}

${cont[index]}`
  });
    console.log(done);
    fs.writeFileSync("READ.md", done, "utf8", err => {return err});

  }
  catch(err) {
    console.log(err);
    
  }
};
let tocList = [];

// maybe do one function, askTOC and another, buildTOC
//oh, and use async/await for that TOC stuff2

async function tableCreate() {
  try {
    const confTable = await prompt(tableQuestion);
    let bool;
    if (confTable.includeTOC) {
      do {
        const heading = await tableHeading();
        tocList.push(heading.tocHeading);
        const another = await moreHeading();
        bool = another.addHeadingQuestion;
      } while (bool);
      console.log(tocList);
    }
  } catch (err) {
    console.log(err);
  }
}

async function prepText() {
  try {
    let keys = Object.keys(mainAns);
    let prop = Object.values(mainAns);
    let data = "";

    for (let i = 0; i < keys.length; i++) {
      let line = `${keys[i]} : ${prop[i]}`;
      console.log(line);
      data += `${line} \n`;
    }
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

async function read() {
  try {
    fs.readFile("./package.json", "utf8", (err, data) => {
      if (err) throw err;
      data = JSON.parse(data);
      console.log(data);
      dep = data.dependencies;
    });
  } catch (err) {
    console.log(err);
  }
}

async function wholeThing(mainAns, tocList) {
  try {
    await main();
    await tableCreate();
    await fillTable(tocList);
    await prepText(mainAns, tocList);
    // await read();

    process.exit();
  } catch (err) {
    console.log(err);
  }
}

wholeThing();

// tableCreate();
// inquirer.prompt(questions
// ).then( answer => {
//     console.log(answer);
//     //table of contents
//     //write file

// })
