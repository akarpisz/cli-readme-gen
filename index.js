const inquirer = require("inquirer");
const{promisify} = require("util");
const child = require("child_process");

const promptAsync = promisify(inquirer.prompt);

const tocList = [];
// maybe do one function, askTOC and another, buildTOC
//oh, and use async/await for that TOC stuff2

async function tableCreate() {
    try{
    const confirmTable = await promptAsync([{
    type: "confirm",
    name: "includeTOC",
    message: "Include a table of contents? (Recommended)",
}])


    
    
    if(includeTOC) {
        console.log("worked a little");
        
        promptAsync([{
        type: "editor",
        name:"tocHeading",
        message: "Enter Table of Contents heading:"
        }])
    }
} catch(err) {
    console.log(err);
    
}
}    






inquirer.prompt([
    {
        name: "projectTitle",
        message: "Project Title?",
        default: "AwesomeProject"
    },
    {
        name: "description",
        message: "Write a brief description",
        default: "A project that does stuff."
    },
    {
        name: "installation",
        message: "Installation:",
        default: "npm install"
    },
    {
      name: "usage",
      message: "Describe your project's use:",    
    },
    {
        name:"license",
        message: "License Type:",
        default: "MIT"
    },
    {
        name:"contributors",
        message: "Contributors"
    },
    {
        name: "tests",
        message: "Test Commands:"
    },
    {
        name: "githubPic",
        message: "Github Picture:"
    },
    {
        name: "githubEmail",
        message: "Github Email:"
    }
]).then( answer => {
    console.log(answer);
    //table of contents
    //write file
    child.exec("git config --get remote.origin.url", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        } else{
        let obj = stdout;
        console.log(obj);
        
    }
})
})