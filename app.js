const express = require('express')
const connectDB = require('./DB/connectDB')
const { userRouter, adminRouter, postRouter } = require('./routers.js/all.router')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(express.json())
app.use(userRouter, adminRouter, postRouter)
connectDB()
app.listen(port, () => { console.log(`running on port ${port}`); })
