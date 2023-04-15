import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';

dotenv.config();

const dbHost: string  = process.env.DB_HOST!;
const dbName: string = process.env.DB_NAME!;
const dbUser: string = process.env.DB_USER!;
const dbPassword: string = process.env.DB_PASSWORD!;

const options: object = {
  host: dbHost,
  dialect: 'mssql',
}

export const wcCoreMSQLConnection = new Sequelize(dbName, dbUser, dbPassword, options);