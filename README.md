# Evil Employee Tracker

[![Hippocratic License HL3-FULL](https://img.shields.io/static/v1?label=Hippocratic%20License&message=HL3-FULL&labelColor=5e2751&color=bc8c3d)](https://firstdonoharm.dev/version/3/0/full.html)

An evil node.js command line app to keep track of your employees. Should we have given you a web interface? Probably! But we're evil, so you get a CLI. ¯\\\_(ツ)\_/¯

Note: you can use Evil Employee Tracker to keep track of your good employees as well as your evil ones.

---
**Table of Contents**
* [Installation](#installation)
* [Usage](#usage)
* [Demo video](#demo-video)
* [License](#license)
* [Questions](#questions)
---

## Installation

You'll need Node.js, npm, and mysql. Clone this repo. From your command line, go to the repo directory and run `npm install`, then log into mysql and run `source db/schema.sql`. If you want, you can also seed the resulting new database by running `source seeds.sql`.

Open `.env.EXAMPLE` and change the database user and password to your own. Optionally, change the database name and host; these are `employees_db` and `localhost` by default. Rename the file to `.env`.

With that out of the way, you can run `node server.js`.

## Usage

From the main menu, you can view all departments, roles, and employees. You can create all of these, too, but bear in mind the proper sequence: an employee MUST HAVE a role, and a role MUST HAVE a department. Start with departments and work your way down. Also start from the top of your organizational hierarchy; add managers before you add their direct reports.

## Demo video




## License
This project uses the [Hippocratic License, v3.0](https://firstdonoharm.dev). TL;DR, it's not *quite* open source, but as long as you're not violating human rights, being a fossil fuel company, conducting military operations, etc (see license for full details), you can essentially treat it as open source. The irony of using the Hippocratic License on "Evil Employee Tracker" is not lost on us. In fact, it amuses us.

## Questions?

Contact [lshillman](https://github.com/lshillman) via methods described at [lukehillman.net](https://lukehillman.net).