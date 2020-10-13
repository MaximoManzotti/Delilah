const express = require('express')
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const db = require('./db/database')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv').config();

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors());
app.use(cookieParser())


//Inicializacion del server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server start');
});



//controllers 

const UserRoutes = require('./routes/users');
const OrderRoutes = require('./routes/orders');
const ProductRoutes = require('./routes/products');

app.use('/products', ProductRoutes)
app.use('/orders', OrderRoutes)
app.use('/users', UserRoutes)


// prueba database
db.authenticate()
  .then(() => {
    console.log("Database conectada");
})
  .catch((error) => {
    console.log('no arranco');
});

