const express = require('express')
const app = express()
const port = 3000
const indexRouter = require('./indexRoutes');

app.use('/', indexRouter);

app.listen(port, () => console.log(`Mock server listen on ${port}!`))