const express = require('express');
const app = express();
const mainRouter = require('./router.js')

app.use(express.json());
app.use('/', mainRouter);

app.listen(process.env.PORT, function () {
  console.log('Server is running on PORT: ', process.env.PORT);
});