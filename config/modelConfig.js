const mongoose = require('mongoose');

const logger = require('../utils/logger')

mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
})

mongoose.connection.on('connected', () => {
    console.log("Mongoose Connected")
    logger.log('info', 'Mongoose Connected')
})
mongoose.connection.on('error', (error) => {
    console.log('Mongoose connecting error')
    console.log(`Error: ${error}`)
    logger.log(`Mongoose Error: ${error}`)
})
