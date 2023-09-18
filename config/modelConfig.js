const mongoose = require('mongoose');

mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
})

mongoose.connection.on('connected', () => {
    console.log("Mongoose Connected")
})
mongoose.connection.on('error', (error) => {
    console.log('Mongoose connecting error')
    console.log(`Error: ${error}`)
})
