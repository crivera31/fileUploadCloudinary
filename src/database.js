const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, /**esto requiere mongo o nodejs para conectarte bn a la db */
  useFindAndModify: false
})
.then(db => console.log('Database is connected.'))
.catch(err => console.error(err))