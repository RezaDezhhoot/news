# Pirooz Backend

## Get started
````bash
copy src/.env.example src/.env
````
### Launching project on Docker
````bash
./installer.sh
````
Now the admin panel is available with the number ****1234**** and password ****1234**** on ****APP_DOMAIN/admin/login****
#### Service logs
````bash
docker-compose logs -f nodejs-app
````
### Launching project with npm

#### Install dependencies and nodemon
````bash
npm install
npm install -g nodemon
````
####  Add default admin panel
````bash
npm run admin-seeder
````
Now the admin panel is available with the number ****1234**** and password ****1234****

####  Run app
you can enter the following command to run app on development mode
````bash
npm run dev
````
you can Now access to the admin panel on ****APP_DOMAIN/admin/login****

####  Add custom admin account
Execute the following command and enter your profile information
````bash
npm run user-seeder

1) Enter your name : Your name
2) Enter your phone : Your phone
3) Enter your password : Your password
4) Enter your country code (example:0098) : Your country code
````

####  Test app
You can use the following command to test the app
````bash
npm test
````