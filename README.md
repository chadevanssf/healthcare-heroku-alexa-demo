# healthcare-heroku-alexa-demo

An Alexa Skill project using the [violet-conversations](https://github.com/salesforce/violet-conversations) module. Leverages Heroku for the logic instead of Amazon Lambda, and uses Heroku Connect to access data from Salesforce for the business logic.

## Installation Order

1. Install Salesforce backend (see [https://github.com/chadevanssf/healthcare-lightning-platform-demo](https://github.com/chadevanssf/healthcare-lightning-platform-demo))
1. Install Heroku app (this project)
1. Install Alexa Skill (this project)

## Deploying locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed. Must also have a local copy of Postgres (example for Mac: [https://postgresapp.com/](https://postgresapp.com/))

1. Set the local postgres to the environment variable:
  ```sh
  export DATABASE_URL=postgres:///$(whoami)
  ```

1. Get the code and run it locally:
  ```sh
  git clone https://github.com/chadevanssf/healthcare-heroku-alexa-demo.git # or clone your own fork
  cd violet-hospital-room
  npm install
  npm start
  ```

1. Your app should now be running on *[http://localhost:8080](http://localhost:8080)*.

### Testing it locallay

You can access a test page to verify if the basic setup is working fine: *[http://localhost:8080/](http://localhost:8080/)*, which will list all the Alexa Skill Apps configured with this project, and you can select on each one to test the response.

### SSL required

You must have SSL enabled in your local psql for this to work. Suggested way to enable is found at [https://www.postgresql.org/docs/9.6/static/ssl-tcp.html](https://www.postgresql.org/docs/9.6/static/ssl-tcp.html) under Creating a Self-signed Certificate

## Deploying to Heroku

```sh
heroku create <heroku-app-name>
git push heroku master
heroku open
```

Alternatively, you can deploy your own copy of the app using this button:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/chadevanssf/healthcare-heroku-alexa-demo)

Your app should now be running on *[https://`<heroku-app-name>`.herokuapp.com](https://`<heroku-app-name>`.herokuapp.com)*, where `<heroku-app-name>` is the heroku app name.

### Adding Heroku Connect

You will need to have a Salesforce org with the following project installed:

[https://github.com/chadevanssf/healthcare-lightning-platform-demo](https://github.com/chadevanssf/healthcare-lightning-platform-demo)

You can then import the connection configuration at */util/healthcare-heroku-alexa-demo.json*.

### Testing it on Heroku

You can access a test page to verify if the basic setup is working fine: *[https://`<app-name>`.herokuapp.com/](https://`<app-name>`.herokuapp.com/)*.

## Deploying to Alexa Skill

You can access the Registration page to get the information that the Alexa Skill requires.

## Helpful Commands

Get changes from your local git into Heroku

```sh
git add .
git commit -m "Updates"
git push heroku master
```

Get the Postgres DB connection info:

```sh
heroku pg:credentials:url DATABASE
```

Set your app to be production:

```sh
export NODE_ENV=production
```
