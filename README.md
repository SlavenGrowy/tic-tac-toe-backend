# Tic-Tac-Toe Backend

## DB setup script

We don't want to create a table on every app startup or in production, so we need a way to control when we execute the DynamoDB setup script.
So, in the package.json file in "scripts" property, we add "node index.js" which can be executed by running "db-init".

## TODO
- Open the cmd
- Set NODE_ENV (SET NODE_ENV=production/development)
- Set SETUP_DB (SET SETUP_DB=true/false)
- npm script that initializes the database : **npm run db-init**

⚠️ If you want to create a table, the app should be running in development and you should set the db to true! ⚠️
