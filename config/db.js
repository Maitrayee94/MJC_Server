'use strict'
const mongoose = require('mongoose')

mongoose.set("strictQuery", false)

try {

    // mongoose.connect(process.env.DB_URI, {
    //     useUnifiedTopology: true,
    //     useNewUrlParser: true
    // })
    mongoose.connect('mongodb+srv://maitrayeedas94:PWdCW9Ver56mbr5p@cluster0.uxlgspp.mongodb.net/MJC_DB', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    
    const db = mongoose.connection

    db.once('open', function () {
        console.log('Database connected successfully!')
    })

} catch (error) {
    db.on('error', console.error.bind(console, 'Database connection failed'))
}