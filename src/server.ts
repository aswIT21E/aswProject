/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import { connect } from 'mongoose';
import cors from 'cors';
import https from 'https';
import { routes } from '~/infrastructure';
dotenv.config();

const app = express();

//middleware
app.use(
  express.urlencoded({
    extended: true,
  }),
  fileUpload(),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use('/', routes);

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

async function connectToMongo() {
  const MONGO_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
  console.log('Connecting to database...');
  connect(MONGO_URI).then(() =>
    console.log('Connected to database: ', DB_NAME),
  );
}

connectToMongo();

const PORT = process.env.NODE_LOCAL_PORT;

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});

https.createServer(app).listen(8443);

module.exports = app;
