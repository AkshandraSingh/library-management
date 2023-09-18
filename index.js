require('dotenv').config()
const express = require('express')

require('./config/modelConfig')

const app = express()

app.use(express.json())

const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
