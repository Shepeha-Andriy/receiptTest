import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

import { sequelize } from './models/db.js'
import productRoutes from './routes/product.js'
import receiptRoutes from './routes/receipt.js'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/product', productRoutes)
app.use('/api/receipt', receiptRoutes)

async function start() {
 try {
  await sequelize.authenticate()
  await sequelize.sync({ force: false })

  app.listen(process.env.PORT || 8080, () => {
    console.log(`server started at port ${process.env.PORT || 8080}`)
  })
 } catch (error) {
  console.log(error)
 }
}

start()
