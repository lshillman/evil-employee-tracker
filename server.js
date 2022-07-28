const mysql = require('mysql2');
const inquirer = require('inquirer');

// actually kind of upset that this was a requirement; node's native console.table method produces much nicer tables!
const cTable = require('console.table');
const dotenv = require('dotenv').config();



// Connect to database - create a .env file with your own config info
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    },
    
    console.log(`Connected to the employees_db database.`));



// Questions for the main menu
const mainMenuQuestions = [
    {
        type: 'list',
        name: 'action',
        message: "Please choose an option:",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Quit"]
    }
];




function beginMainMenu() {
    inquirer
        .prompt(mainMenuQuestions)
        .then((answers) => {
            switch (answers.action) {
                case "View all departments":
                    viewDepts();
                    break;
                default:
                    beginMainMenu();
            }
          });
}

function viewDepts() {
    db.query('SELECT * FROM department', function (err, results) {
        console.log("\n");
        console.table(results);
        beginMainMenu();
    });
}



function init() {
    beginMainMenu();
}

init();