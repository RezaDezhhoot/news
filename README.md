# Pirooz Backend

## Get started
````bash
copy src/.env.example src/.env
````
### Install dependencies
````bash
npm install
````
### Launching the project on Docker
#### Run docker compose up
````bash
./installer.sh
````
Now the admin panel is available with the number ****1234**** and password ****1234****
#### Service logs
````bash
docker-compose logs -f nodejs-app
````
### Launching the project with npm

#### Install nodemon
````bash
npm install -g nodemon
````
####  Add default admin panel
````bash
npm run admin-seeder
````
Now the admin panel is available with the number ****1234**** and password ****1234****

####  Add custom admin account
Execute the following command and enter your profile information
````bash
npm run user-seeder

1) Enter your name : Your name
2) Enter your phone : Your phone
3) Enter your password : Your password
4) Enter your country code (example:0098) : Your country code
````
####  Run app
you can enter the following command to run app on development mode
````bash
npm start
````
you can Now access to the admin panel in ****APP_DOMAIN/admin/login****

####  Test app
You can use the following command to test the app
````bash
npm test
````