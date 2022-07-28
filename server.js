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

// The arrays below store values for inquirer prompts. The objects allow the resulting answers to be translated to their database IDs.
// TODO: refactor this so these variables are not in the global scope. Can't make the functions properly async this way.
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
        return 0;
    });
}

function getRoles() {
    db.query('SELECT * FROM role', function (err, results) {
        for (item of results) {
            roleMap[item.title] = item.id;
            roleArray.push(item.title);
        }
    });
}


// This is a badly-written attempt to make getEmployees async. Need to come back later and make it work.
//
// function getEmployees() {
//     return new Promise(function (res, rej){
//         db.query('SELECT * FROM employee', function (err, results) {
//             for (item of results) {
//                 let name;
//                 if (item.last_name) {
//                     name = item.first_name + " " + item.last_name;
//                 } else {
//                     name = item.first_name;
//                 }
//                 empMap[name] = item.id;
//                 empArray.push(name);
//             }
//             console.log('getEmployees query complete!');
//             if (err) {
//                 return rej(err);
//             }
//             return res();
//         });
//     })
// }


// this only works because there's one inquirer question before empArray is needed. If the user were a computer, it would fail. Need to refactor.
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
    });
}



// Questions for the main menu
const mainMenuQuestions = [
    {
        type: 'list',
        name: 'action',
        message: "Please choose an option:",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"]
    }
];

// Question for adding a department
const deptQuestions = [
    {
        type: 'input',
        name: 'deptName',
        message: "Enter new department name:"
    }
]

// Questions for adding a new role
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

// Questions for adding a new employee
const employeeQuestions = [
    {
        type: 'input',
        name: 'firstName',
        message: "Enter employee's first name:"
    },
    {
        type: 'input',
        name: 'lastName',
        message: "Enter employee's last name:"
    },
    {
        type: 'list',
        name: 'role',
        message: "Select employee's role:",
        choices: roleArray
    },
    {
        type: 'list',
        name: 'manager',
        message: "Select employee's manager:",
        choices: empArray
    }
]

// Questions for updating an employee's role. The first question needs an array of values that comes from a db query, which is why this code is currently so messy.
const updateRoleQuestions = [
    {
        type: 'list',
        name: 'employee',
        message: "Select employee to update:",
        choices: empArray
    },
    {
        type: 'list',
        name: 'role',
        message: "Select new role:",
        choices: roleArray
    }
]

// the main menu
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
                case "Update an employee role":
                    updateEmployee();
                    break;
                case "Quit":
                    process.exit();
            }
          });
}

// view all departments
function viewDepts() {
    db.query('SELECT * FROM department', function (err, results) {
        console.log("\n");
        console.table(results);
        mainMenu();
    });
}

// view all roles
function viewRoles() {
    db.query('SELECT role.id, role.title, department.name, role.salary FROM role INNER JOIN department ON department.id = role.department_id ORDER BY role.id ASC', function (err, results) {
        console.log("\n");
        console.log(err);
        console.table(results);
        mainMenu();
    });
}

//view all employees
function viewEmployees() {
    db.query('SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, " ", m.last_name) AS manager FROM employee e JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee m ON m.id = e.manager_id', function (err, results) {
        console.log("\n");
        console.log(err);
        console.table(results);
        mainMenu();
    });
}

// add a department
function addDept() {
    inquirer
    .prompt(deptQuestions)
    .then((answers) => {
         db.query('INSERT INTO department (name) VALUES (?)', answers.deptName, function (err, results) {
            if (err) throw err;
            // console.log(results);
        });
        console.log("\n");
        mainMenu();
      });
}

// add a role
function addRole() {
    getDepts();
    inquirer
    .prompt(roleQuestions)
    .then((answers) => {
         db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.roleName, answers.roleSalary, deptMap[answers.roleDept]], function (err, results) {
            if (err) throw err;
            //console.log(results);
            // console.info("\nSuccessfully added " + answers.roleName + ".\n")
        });
        console.log("\n");
        mainMenu();
      });
}

// add an employee
function addEmployee() {
    empArray = [];
    empArray.push('none');
    getRoles();
    getEmployees();
    inquirer
    .prompt(employeeQuestions)
    .then((answers) => {
         let manager;
         if (answers.manager != 'none') {manager = answers.manager}
         else {manager = null}
         db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.firstName, answers.lastName, roleMap[answers.role], empMap[manager]], function (err, results) {
            if (err) throw err;
        });
        console.log("\n");
        mainMenu();
      });
}

// the first version of updateEmployee. Possibly can be salvaged after getEmployees works as intended.
//
// function updateEmployee() {
//     empArray = [];
//     getRoles();
//     getEmployees().then((data) => {
//     inquirer
//     .prompt(updateRoleQuestions)
//     .then((answers) => {
//          db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleMap[answers.role], empMap[answers.employee]], function (err, results) {
//             if (err) throw err;
//         });
//         console.log("\n");
//         mainMenu();
//       });
//     });
// }

function updateEmployee() { // I'm sorry, this is messy. I couldn't use getEmployees here because it wouldn't finish in time for the first question. I'll come back later and make this properly async.
    getRoles();
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
        inquirer
        .prompt(updateRoleQuestions)
        .then((answers) => {
             db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleMap[answers.role], empMap[answers.employee]], function (err, results) {
                if (err) throw err;
            });
            console.log("\n");
            mainMenu();
          });
    });
}


// run this on start
function init() {
    console.clear();
    mainMenu();
}

init();