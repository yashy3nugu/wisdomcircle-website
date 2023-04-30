# Wisdomcircle website

Deployed  [here](https://wisdomcircle-website.vercel.app/)

## Getting Started

### Make sure you have installed Node JS and yarn and Postgres

- Create a .env file like and copy the values already set in .env.example file (used for ethereal mail credentials)
- Add the postgres connection URL which will look something like (postgresql://janedoe:mypassword@localhost:5432/mydb) into the **DATABASE_URL** field of the .env file.
- Then follow the steps below


Running dev server

        yarn install 
        yarn prisma generate 
        yarn dev

Building the app

        yarn build

