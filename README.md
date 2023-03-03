### Task1 :

Write a program which reads a string from the standard input stdin, reverses it and then writes it to
the standard output stdout.

• The program should be started from npm script via nodemon (i.e. npm run task1).

• The program should be running in a stand-by mode and should not be terminated after the first-string processing.

### TASK 1.2

Write a program which should do the following:

• Read the content of csv file from ./csv directory. Example: https://epa.ms/nodejs19-hw1-ex1

• Use the csvtojson package (https://github.com/Keyang/node-csvtojson) to convert csv file to
json object.

• Write the csv file content to a new txt file.
Use the following format: https://epa.ms/nodejs19-hw1-ex2.

• Do not load all the content of the csv file into RAM via stream (read/write file content line by
line).

• In case of read/write errors, log them in the console.

• The program should be started via npm script using nodemon (i.e. npm run task2).

### TASK 1.3

Rewrite the above-mentioned programs to use babel (https://babeljs.io/) and ES6 modules.

### TASK 2.1

Write a simple REST service withCRUD operations for User entity.

- To create REST service,use ExpressJS (https://expressjs.com/)
- Service should have the following CRUD operations for User:

  - get user by id;
  - create and update user;
  - get auto-suggest list from limitusers, sorted by login property and filtered
    by loginSubstringin the login property. getAutoSuggestUsers(loginSubstring, limit)
  - remove user (soft delete–user gets marked with isDeletedflag, but not
    removed from the collection).

- Store user’scollection in the service memory (while the service is running).

### TASK 2.2

Add server-side validation for create/update operations of Userentity:

- all fields are required;
- login validationis required;
- password must contain letters and numbers;
- user’s age must be between 4 and 130.

In case of any property does not meet the validation requirements or the field
is absent, return 400 (Bad Request) and detailed error message. For requests
validation use special packages like joi.

### TASK 3.1

- Install DB PostgreSQL on your machine or use a free web hosting services for
  PostgreSQL (https://www.heroku.com/postgresor
  https://www.elephantsql.com/plans.html).
- Write SQL script which will create Users table in the DB and fillit in with
  predefined users’collection.
- Configure your REST service to work with PostgreSQL.
- Use the sequelize package(http://docs.sequelizejs.com/)as ORM to work with
  PostgreSQL. As an alternative to sequelizeyou can use more low-level
  query-builderlibrary(http://knexjs.org/).

### TASK 3.2

The service should adhere to 3-layer architecture principles
(https://softwareontheroad.com/ideal-nodejs-project-structure/) and contain the
following set of directories:

- routers/
- controllers/
- services/
- data-access/
- models/
