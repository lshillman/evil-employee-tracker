INSERT INTO department (name)
VALUES ("Command"),
       ("Operations"),
       ("Engineering"),
       ("Science"),
       ("Medical");

INSERT INTO role (title, salary, department_id)
VALUES ("Captain", 100, 1),
       ("First Officer", 80, 1),
       ("Head of Security", 80, 2),
       ("Chief Engineer", 80, 3),
       ("Chief Science Officer", 80, 4),
       ("Chief Medical Officer", 80, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jean-Luc", "Picard", 1, null),
       ("William", "Riker", 2, 1),
       ("Tasha", "Yar", 3, 2),
       ("Geordi", "LaForge", 4, 2),
       ("Data", "", 5, 2),
       ("Beverly", "Crusher", 6, 1);