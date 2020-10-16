const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
// const Employee = require("./lib/Employee");

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
let teamMembers = "";
const employees = [];
const employeeQues = [
    {
        name: 'name',
        type: 'input',
        message: 'What is their name?'
    },
    {
        name: 'id',
        type: 'input',
        message: 'What is their id?'
    },
    {
        name: 'email',
        type: 'input',
        message: 'What is their email?'
    },
];

const engineerQues = [
    {
        name: 'github',
        type: 'input',
        message: 'What is their github?'
    }
];
const internQues = [
    {
        name: 'school',
        type: 'input',
        message: 'What is their School?'
    }
];
const managerQues = [
    {
        name: 'officeNumber',
        type: 'input',
        message: 'What is their Office Number?'
    }
];

async function init() {
    try {
        const answers = await inquirer.prompt([
            {
                name: 'choice',
                type: 'list',
                message: 'What position are you currently logging?',
                choices: ['Manager', 'Engineer', 'Intern', 'quit']
            },

        ]);
        switch (answers.choice) {
            case 'Manager':
                const managerAns = await inquirer.prompt([...managerQues, ...employeeQues])
                const newManager = new Manager(managerAns.officeNumber, managerAns.name, managerAns.id, managerAns.email);
                employees.push(newManager);
                init();
                break;
            case 'Engineer':
                const engineerAns = await inquirer.prompt([...engineerQues, ...employeeQues])
                const newEngineer = new Engineer(engineerAns.github, engineerAns.name, engineerAns.id, engineerAns.email);
                employees.push(newEngineer);
                init();
                break;
            case 'Intern':
                const internAns = await inquirer.prompt([...internQues, ...employeeQues])
                const newIntern = new Intern(internAns.school, internAns.name, internAns.id, internAns.email);
                employees.push(newIntern);
                init();
                break;
            default:
                console.log(employees);
                console.log("Bye");
                buildHtmlPage();
        }

    } catch (err) {
        console.log(err);
        init();
    }


    function buildHtmlPage() {
        let newFile = fs.readFileSync("./templates/main.html");
        fs.writeFileSync('output.html', newFile, function (err) {
            if (err) throw err;
        })
        console.log("Your base html has been created!");

        for (member of employees) {
            if (member.getRole() == "Manager") {
                htmlCard("manager", member.getName(), member.getId(), member.getEmail(), "Office Number: " + member.getOfficeNumber());
            } else if (member.getRole() == "Engineer") {
                htmlCard("engineer", member.getName(), member.getId(), member.getEmail(), "GitHub: " + member.getGithub());
            } else if (member.getRole() == "Intern") {
                htmlCard("intern", member.getName(), member.getId(), member.getEmail(), "School: " + member.getSchool());
            };
        };

    };
    function htmlCard(memberType, name, id, email, officeNumber, gitHub, school) {
        let data = fs.readFileSync(`./templates/${memberType}.html`, 'utf8')
        data = data.replace(/{{ name }}/g, name);
        data = data.replace(/{{ role }}/g, getRole());
        data = data.replace(/{{ id }}/g, `ID: ${id}`);
        data = data.replace(/{{ email }}/g, `Email: <a href="mailto:${email}">${email}</a>`);
        data = data.replace(/{{ officeNumber }}/g, `Office Number: ${officeNumber}`);
        data = data.replace(/{{ school }}/g, `School: ${school}`)
        data = data.replace(/{{ github }}/g, `GitHub: ${gitHub}`)
        fs.appendFileSync("./output/teamPage.html", data, err => { if (err) throw err; })
        console.log("Card appended");
    }
}
init();

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
// for the provided `render` function to work! ```
