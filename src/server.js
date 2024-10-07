const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const cors = require('cors');
const app = express()
require('colors')


app.use(cors());
  

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(express.static('./public'))

app.use('/auth', require('./routes/auth.routes'))
app.use('/sms', require('./routes/sms.routes'))
app.use('/report', require('./routes/report.routes'))

app.use(require('./middlewares/errorHandler'))

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`.blue);
});
