const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");

// create directory if not exists
if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR);
}

const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const managerPrompts = [
    {
      type: 'input',
      name: 'name',
      message: 'Enter manager name: '
    },
    {
      type: 'input',
      name: 'id',
      message: 'Enter manager id: '
    },
    {
      type: 'input',
      name: 'email',
      message: 'Enter manager email: '
    },
    {
      type: 'input',
      name: 'officeNumber',
      message: 'Enter manager officeNumber: '
    }
];

const engineerPrompts = [
    {
      type: 'input',
      name: 'name',
      message: 'Enter engineer name: '
    },
    {
      type: 'input',
      name: 'id',
      message: 'Enter engineer id: '
    },
    {
      type: 'input',
      name: 'email',
      message: 'Enter engineer email: '
    },
    {
      type: 'input',
      name: 'github',
      message: 'Enter engineer github: '
    }
];

const internPrompts = [
    {
      type: 'input',
      name: 'name',
      message: 'Enter intern name: '
    },
    {
      type: 'input',
      name: 'id',
      message: 'Enter intern id: '
    },
    {
      type: 'input',
      name: 'email',
      message: 'Enter intern email: '
    },
    {
      type: 'input',
      name: 'school',
      message: 'Enter intern school: '
    }
];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an 
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```

const collectManagerInputs = async () => {
    const answers = await inquirer.prompt(managerPrompts);
    return new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
};

const collectEngineerInputs = async () => {
    const answers = await inquirer.prompt(engineerPrompts);
    return new Engineer(answers.name, answers.id, answers.email, answers.github);
};

const collectInternInputs = async () => {
    const answers = await inquirer.prompt(internPrompts);
    return new Intern(answers.name, answers.id, answers.email, answers.school);
};



const collectTeamsInputs = async (teams = []) => {
    const choicePrompts = [
      {
        type: 'list',
        name: 'role',
        message: 'Engineer or Intern?',
        choices: ['Engineer', 'Intern'],
      }
    ];

    const confirmPrompts = [
        {
            type: 'confirm',
            name: 'again',
            message: 'Enter another input? ',
            default: true
        }
      ];

    const answers = await inquirer.prompt(choicePrompts);

    var member = null;
    if (answers.role === "Engineer") {
        member = await collectEngineerInputs();
    } else 
    {
        member = await collectInternInputs();
    }
    // console.log(member);
    const newInputs = [...teams, member];
    // console.log(newInputs);
    const { again } = await inquirer.prompt(confirmPrompts);

    return again ? collectTeamsInputs(newInputs) : newInputs;
};

const main = async () => {
    const manager = await collectManagerInputs();
    // console.log(manager);
    const teams = await collectTeamsInputs();
    // console.log(teams);
    const allTeams = [manager, ...teams];

    const html = render(allTeams);
    fs.writeFile(outputPath, html, (err) => {
        if (err) {
          console.error(err)
          return
        }
        //file written successfully
    })
};

main()