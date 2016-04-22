# MessageBroker
Simple HTTP message broker server

## Dependencies
1. nodejs
2. mongodb
3. Grunt (global command)
4. Mocha (global command)
5. all other dependencies can be resolved with a call to "npm install"

## Running the message server
The message server can be run using the file /scm/index.js

## Running the message admin client
The message admin client is a webpage at **localhost:3000/testClient/admin**

## Running a test consumer
A message consumer can be run by going to the page: **localhost:3000/testClient**. These test clients are disposable, meaning that if you refresh the page, you will get a brand new client.

I would suggest opening multiple message consumers in multiple tabs in a browser.

## Unit tests
You can run unit tests using "mocha --recursive"

## A note on typescript and data types
This application was built using typescript. I decided on typescrit because of it's excellent object oriented framework, UMD and to cut down on validating data types.

By the same token however, I am ignoring a very important area of data validation, within the web routes. Had I the time, I would have built a grunt plugin to auto build typescript data validators which could be used in the routing layer of the application.

If you make changes to a .ts file, you can compile them using the command "grunt typescript". When compiling typescript, the code comments are not transferred, so it may be better to read the .ts files instead.

## A note on mongodb
I decided that redundency was one of my primary goals with this project. This meant that I had to include the file system, and could not just save queues to RAM. Initially I was considering writing my own protocol for message storage, but finally decided that this would be quite un necessary, long and somewhat boring work.

I decided on mongodb above other databases/persistance mechanisms as it is fast and easy to use.

## A note on the Command infrastructure
With the command infrastructure I am trying to separate application logic into two dimensions

1. The first dimension is vertical, i.e. up and down the stack. Elements which live on this dimension are web, businessLogic, repository etc...
2. The second dimension is vertical, i.e. across the modules on a specific level of the stack. This promotes breaking down business logic into specific commands which can then be re-used on other levels of the stack, but also, but other commands. These commands can then be chained and persisted as a batch in a transaction like (although mongodb does not support transactions) manner.

## A note on my test approach
I decided not to introduce a suite of integration tests because

1. The time involved in setting up an integration test environment
2. I believe that integaration tests without unit tests are a dangerous thing, so I chose unit only. In an enterprise environment, I have noticed that without a good suite of unit tests, broken integration tests usually do not indicate bad code (only bad tests), and can suck up huge amounts of development time.
3. Integaration tests do not highlight a developers test style as much as unit tests do.

I decided not to unit test a lot of my business logic commands, simply because there is no business logic to them, only db save commands and so, nothing much to test.

## Project structure
1. Project build files: **Gruntfile.js, package.json, tsconfig.json**
2. **scm**
  1. **businessLogic** business logic and commands
  2. **entity** entity interfaces
  3. **mappers** objects to map from entities to dtos
  4. **repository** repository types, 1 per entity type
  5. **stack** infrastructure code
    1. **command** base classes for how application logic should be organised and executed
    2. **db** database driver
    3. **lockManager** Base class to provide locking of a resource
    4. **log** wrapper of log and error functionality
  6. **typescriptDefinitions** .d.ts files to document external .js libraries
  7. **web** External facing functionality
    1. **dto** Interfaces for data to be sent to the clients
    2. **routes** Published web routes
    3. **bodyParsing** parse the body of a request
    4. **webServer** builds a server object
3. **test/unit** Unit tests 
