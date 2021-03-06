#!/usr/bin/env node

const { prompt } = require("inquirer");
// const child = require("child_process");
const fs = require("fs");

const questions = [
  {
    name: "projectTitle",
    message: "Project Title?:",
    default: "AwesomeProject",
  },
  {
    name: "description",
    message: "Write a brief description",
    default: "A project that does stuff.",
  },{
    name: "version",
    message: "version:",
    default: "1.0.0"
  },
  {
    name: "installation",
    message: "Installation:",
    default: "npm install",
  },
  {
    type: "list",
    name: "license",
    message: "License Type:",
    choices: ["MIT", "GNU AGPLv3", "GNU GPLv3", "GNU LGPLv3", "Boost Software License 1.0", "Apache License 2.0", "Mozilla Public License 2.0", "none"],
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
let badge;
let version;
let topData = "";
let mainAns;
let contTOC = [];
let tocList = [];
let pic;
const formattedTOC = [];




const genBadge = async() => {
  try{
    const { label, message, color} = await prompt([
    {
      name: "label",
      message: "Badge label:"
    },
    {
      name: "message",
      message: "Badge message:"
    },
    {
      name: "color",
      message: "Badge color:"
    }
  ])

   badge = `<img src="https://img.shields.io/badge/${label}-${message}-${color}"></img>`;
  } catch(err){ throw err};
}

const getPic = async () => {
  const ans = await prompt([
    {
      name: "githubPic",
      message:
        "Github Picture (use the file path, hosted on github or elsewhere):",
    },
    {
      name:"altText",
      message: "Enter desired alt text for the picture"
    }
  ]);
  pic = `![${ans.altText}](${ans.githubPic})`;
};

const githubUser = async () => {
  const userName = await prompt([
    {
      name: "githubUsername",
      message: "Enter your Github username:",
    },
  ]);
  return userName.githubUsername;
};

const main = async () => {
  const mainQuestions = await prompt(questions);
  mainAns = mainQuestions;
  version = (mainAns.version);
}

const tableHeading = async () => {
  let ans = prompt([
    {
      name: "tocHeading",
      message: "Enter a Table of Contents heading:",
    },
  ]);

  return ans;
};
const moreHeading = async () => {
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
  for (let i = 0; i < tocList.length; i++) {
    newTOCstr = `${i + 1}. ${tocList[i]}\n`;
    formattedTOC.push(newTOCstr);
  }
};
const fillTable = async () => {
  try {
    let cont = [];

    for (let i = 0; i < tocList.length; i++) {
      let ans = await prompt([
        {
          name: `${tocList[i]}`,
          message: `add content for ${tocList[i]}:`,
        },
      ]);
      cont.push(Object.values(ans).join(""));
    }
    contTOC = tocList.map((value, index) => {
      return `##${value}\n\n${cont[index]}\n\n`;
    });
  } catch (err) {
    console.log(err);
  }
};

const tableCreate= async () => {
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

const prepText = async () => {
  try {
    let keys = Object.keys(mainAns);
    let prop = Object.values(mainAns);

    for (let i = 0; i < keys.length; i++) {
      let line = `${keys[i]} : ${prop[i]}\n`;
      topData += `${line} \n`;
    }
  } catch (err) {return err};
};

const writeAll = async () => {
  let finishedREADME = `${badge}\n\n${topData}\n\n${pic}\n\n\n${formattedTOC.join("")}\n\n${contTOC.join("")}`;

  fs.writeFileSync("./README.md", finishedREADME, "utf8", (err) => {
    return err});
  console.log("finished");
};

async function wholeThing(mainAns, tocList) {
  try {
    // const userName = await githubUser();
    // console.log(userName);

    await main();
    await genBadge();
    await getPic();
    await tableCreate();
    await formatTOC(tocList);
    await fillTable(tocList);
    await prepText(mainAns, tocList);
    await writeAll();
    process.exit();
  } catch (err) {
    return err;
  }
}
wholeThing();

