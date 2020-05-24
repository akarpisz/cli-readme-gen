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

const tableQuestion = [
  {
    type: "confirm",
    name: "includeTOC",
    message: "Include a table of contents? (Recommended)",
  },
];

let mainAns;
let repo;
let tocList = [];
const formattedTOC = [];

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
      
    },
  ]);
  return ans;
};
const formatTOC = async () => {
  let newTOCstr;
  for(let i = 0; i < tocList.length; i++){
    newTOCstr = `${i+1}. ${tocList[i]}` + "\n";
    formattedTOC.push(newTOCstr);

  }
  console.log(formattedTOC);
  
};
const fillTable = async () => {
  try {
    let cont = [];

    for (let i = 0; i < tocList.length; i++) {
      let ans = await prompt([
        {
          name: `${tocList[i]}`,
          message: `add content for ${tocList[i]}`,
        },
      ]);
      cont.push(Object.values(ans).join(""));
      console.log(cont);
    }
    let done = tocList.map((value, index) => {
      return `##${value}` + "\n" + `${cont[index]}` + "\n\n";
    });

    fs.appendFileSync(
      "README.md", formattedTOC.join("") +
      done.join(""),
      "utf8",
      (err) => {
        return err;
      }
    );
  } catch (err) {
    console.log(err);
  }
};

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
    await formatTOC(tocList);
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
