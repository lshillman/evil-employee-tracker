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
    }, console.log(`Connected to the employees_db database.`));


const deptMap = {};
const deptArray = [];

const roleMap = {};
const roleArray = [];

const empMap = {};
const empArray = [];

function getDepts() {
    db.query('SELECT * FROM department', function (err, results) {
        for (item of results) {
            deptMap[item.name] = item.id;
            deptArray.push(item.name);
        }
        console.log(deptArray);
    });
}

function getRoles() {
    db.query('SELECT * FROM role', function (err, results) {
        for (item of results) {
            roleMap[item.title] = item.id;
            roleArray.push(item.title);
        }
        console.log(roleMap);
    });
}

function getEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
        for (item of results) {
            let name;
            if (item.last_name) {
                name = item.first_name + " " + item.last_name;
            } else {
                name = item.first_name;
            }
            empMap[name] = item.id;
            empArray.push(name);
        }
        console.log(empMap);
    });
}

// Questions for the main menu
const mainMenuQuestions = [
    {
        type: 'list',
        name: 'action',
        message: "Please choose an option:",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Quit"]
    }
];

const deptQuestions = [
    {
        type: 'input',
        name: 'deptName',
        message: "Enter new department name:"
    }
]

const roleQuestions = [
    {
        type: 'input',
        name: 'roleName',
        message: "Enter new role name:"
    },
    {
        type: 'input',
        name: 'roleSalary',
        message: "Enter salary:"
    },
    {
        type: 'list',
        name: 'roleDept',
        message: "Select role dept:",
        choices: deptArray
    }
]




function mainMenu() {
    inquirer
        .prompt(mainMenuQuestions)
        .then((answers) => {
            switch (answers.action) {
                case "View all departments":
                    viewDepts();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add a department":
                    addDept();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Quit":
                    process.exit();
            }
          });
}

function viewDepts() {
    db.query('SELECT * FROM department', function (err, results) {
        console.log("\n");
        console.table(results);
        mainMenu();
    });
}

function viewRoles() {
    db.query('SELECT role.id, role.title, department.name, role.salary FROM role INNER JOIN department ON department.id = role.department_id', function (err, results) {
        console.log("\n");
        console.log(err);
        console.table(results);
        mainMenu();
    });
}

function viewEmployees() {
    db.query('SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, " ", m.last_name) AS manager FROM employee e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee m ON m.id = e.manager_id', function (err, results) {
        console.log("\n");
        console.log(err);
        console.table(results);
        mainMenu();
    });
}

function addDept() {

}



function init() {
    console.clear();
    getEmployees();
   // mainMenu();
}

init();