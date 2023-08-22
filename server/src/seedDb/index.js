import fs from 'fs'
import { Product } from '../models/models.js'
import donent from 'dotenv'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from "sequelize";
donent.config()

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: "localhost",
  port: process.env.DB_PORT,
  dialect: "mysql"
});

const __dirname = dirname(fileURLToPath(import.meta.url));

const products = JSON.parse(fs.readFileSync(`${__dirname}/data/goodSeed.json`, 'utf-8'))

const loadDataGoods = async () => {
  try {
    await sequelize.authenticate()

    await Product.bulkCreate(products)

    await sequelize.close()
    console.log('data loaded')
  } catch (e) {
    console.log(e)
  }
}

loadDataGoods()
