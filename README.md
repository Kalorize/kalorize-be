# Kalorize Backend

This repo also wrap a python-based server on [kalorize-ml-api](https://github.com/Kalorize/kalorize-ml-api) that serve machine learning models.

## How to run

1. Clone the repository using git command
   `git clone https://github.com/kalorize/kalorize-be.git/`
2. Change to cloned folder
   `cd kalorize-be`
3. Install depedencies
   `npm install`
4. Copy and adjust environemnt file
   `cp .env.example .env`
5. Configure .env file

   ```bash
   - Change configuration with:
   PORT=<YOUR_PORT>
   NODE_ENV=<STATE_ENVIRONMENT>
   MYSQL_URL=<DATABASE_URL>
   ML_API_BASE_URL=<YOUR_ML_API_BASE_URL>
   ML_API_KEY=<YOUR_API_KEY>
   JWT_SECRET=<YOUR_JWT_SECRET>
   JWT_EXPIRED=<YOUR_JWT_EXPIRED_TIME>
   GCP_PROJECT=<YOUR_GCP_PROJECT>
   GCP_BUCKET=<YOUR_GCS_BUCKET>
   EMAIL=<YOUR_EMAIL>
   EMAIL_PASSWORD=<YOUR_EMAIL_APP_PASSWORD>
   ```

6. Run project entry point
   `npm start # or using "npm run dev" for run with watch mode`

## Technologies

Project is created with:

- [Node js](https://nodejs.org/en/) is an open source, cross-platform runtime environment for executing JavaScript code and suitable for those who need real time communication between client and server.
  - Node version: V16.3.0
  - NPM version: V8.19.0
- [Framework Express Js](https://expressjs.com/) is a framework that offers several features such as routing, view rendering, and supports middleware in other words it will save a lot of time in Node.js application development instead of using default http module from NodeJS.
  - express: 4.18.2
- [Google Cloud Platform (GCP)](https://cloud.google.com/gcp/) is a reliable option to instantly grow from prototype to production without having to think about capacity, reliability, or performance.
  - Google Cloud SQL: MySQL 8.0
  - Google Cloud Run
  - Google Cloud Storage
  - Google Cloud Build

## API URL

[Destinations API](https://kalorize-be-cwx4yokorq-et.a.run.app)

## API Endpoint

In summary our APIs are described as table below. For further detail, you can see at this [Postman Collection](./kalorize.postman_collection.json).

|              Endpoint              | Method |                                                          Sent                                                           |                                 Description                                  |
| :--------------------------------: | :----: | :---------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------: |
|           /v1/food/{id}            |  GET   |                                                          none                                                           |                 HTTP GET REQUEST Show food with specific id                  |
|             /v1/f2hwg              |  POST  |                                                   Body(FORM) picture                                                    |  HTTP POST REQUEST predict height, weight, and gender based on face picture  |
|           /v1/auth/login           |  POST  |                                               Body(JSON) email, password                                                |                         HTTP POST REQUEST user login                         |
|         /v1/auth/register          |  POST  |                                      Body(JSON) name, email, password, repassword                                       |                     HTTP POST REQUEST register new user                      |
|            /v1/auth/me             |  GET   |                                            Authorization header bearer token                                            |                        HTTP GET REQUEST get user data                        |
|      /v1/auth/forgot-password      |  POST  | Body(JSON) (Request OTP): email; (Validating OTP): email, otp; (Update New Password): email, newpassword, renewpassword | HTTP POST REQUEST let user change password using OTP code sent through email |
|              /v1/user              |  PUT   |  Authorization header bearer token ; Body(FORM) picture, gender, age, height, weight, password, target, activity, name  |                HTTP PUT REQUEST let user change profile data                 |
|        /v1/user/choose-food        |  POST  |                         Authorization header bearer token ; Body(JSON) breakfast, lunch, dinner                         |                   HTTP POST REQUEST save user chosen food                    |
| v1/user/get-food?date={yyyy-mm-dd} |  GET   |                                            Authorization header bearer token                                            |            HTTP GET REQUEST get user chosen food history by date             |

## Security Concern

Right now our server can be accessed by everyone without using our APP. This problem could caused a lot of traffic on our server making it vulnerable againts many cyber attacks. On further development we will deal with our server security problem.
