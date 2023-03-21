
# Authentication Service

It is an User Authentication Service which is an internal service project called [***Flight Booking System API Design***](https://shaikasifali.github.io/FlightBookingSystemAPI/) which was built using the microservice architechture.

It is used to authenticate and authorize the users which was implemented using the ***JWT Tokens***.

## ER DIAGRAM

[![ER1.jpg](https://i.postimg.cc/0yfVfxyC/ER1.jpg)](https://postimg.cc/gxxyzCRw)

## Features
* ***UserRegistration***  
    * user can login by sending his correct email and password
    * plain text password will compare with the stored hashed password 
    * Once logged in a token with cookie (x-access-token =xxx ) is
      send along with response  
    *  JWT and cookie will expire in 30 days  
    * Anyone can access this sign in route

* ***UserLogout***  
    * cookie will be set to set token = none.  
    * only Loggedin user can access this route.

* ***UserRegistration***  
    * User will be able to register with his email and password.
    * Once user is registered , an email is sent to his registered email to verify his email  '
    * password is going to be hashed and saved into the database.
    * Email verfication is therefore compulsory for the registered user to login other wise he will not be able to login.

* ***ForgotPassword***  
    * When user forget his password,he can enter this route.
    * hashed token will be email to the registered email address of user  
    * A put request can be made to update the password of the user
    * The token is therefore valid only for 5mins
    * Only valid token , will led the user to change the password.

* ***AddAdmin***  
    * This route is used to upgrade the role of the user to admin

* ***IsAdmin*** 
    * To check whether the current user is an admin or not.  
    * This route can only be accessed by the logged in users.

* ***IsAuthenticated***  
    * This route is to check whether the user is valid or not.
    * This is checked using the x-access-token in the request header.

* ***GetUser***  
    * This route is used to get the data of an particular user.
    * Only Logged in user can be able to access this route.

* ***GetAllUsers***
    * This route is used to provide the data of all the registered users.


## Deployment

### Install MySql
To Run this project you need to install the ***Mysql*** data base and make sure your database is running.
### Configure Nodemailer
To send the email I have used the ***nodemailer*** using google **GMail**  as an service.

You cn check [this](https://www.youtube.com/watch?v=JgcDZl8eXTg) tutorial to get an idea.

### Configure .env file
You also need to create an **.env** file and add the following details

```bash
   PORT = <the port on which you wish to run the service> // any port like 3000 etc
   VERIFY_SECRET = <the jwt token secret for sending email verification> //any string
   LOGIN_SECRET = <the jwt token secret for creating access token after login> // any string
   USER_EMAIL = <the mail that u have configured with nodemailer>
   USER_PASSWORD = <the password that google provided for above mail>
```
### configure config.json for database
You also need to create a ***config.json*** file inside **/src/config**

```bash 
    {
  "development": {
    "username": <username for mysql> //mostly if not changed it is root,
    "password": <your password> //password for the user,
    "database": <name of database>,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
}

```
### Install all the dependencies

Next from project folder, install all the dependencies
```bash
    npm install
```

### Create the database and perform migrations
navigate to **/src** folder, run the following commands to create the database
```
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```
Wohoo 🥳🥳🥳 Deployment is done now you can test the api.



