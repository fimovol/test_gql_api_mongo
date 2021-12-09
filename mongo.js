const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

mongoose.connect(connectionString)
.then(()=>{
    console.log('base de datos connectada')
}).catch(err => {
    console.error(err)
})

