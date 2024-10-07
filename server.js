const express = require('express');
const cors = require('cors');
const app = express()
const colors = require('colors')

const dotenv = require('dotenv')
dotenv.config()

app.use(cors());
  

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(express.static('./public'))

app.use('/auth', require('./routes/auth.route'))
app.use('/sms', require('./routes/sms.route'))
app.use('/report', require('./routes/report.router'))

app.use(require('./middlewares/errorHandler'))

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`.blue);
});
