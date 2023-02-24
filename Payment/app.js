require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')

//connectDB
const connectDB = require('./db/connect')

//middleware


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(express.static('./public'));
const {getTransactionToken,buyEvent} = require('./controllers/Payments')
//this api will return a token , pass this token to paytm's sdk to load paytm's UI
app.post("/api/v1/payment/initiate-transaction",getTransactionToken)//[req.body = {custId:userId,orderId:orderId,amount}
//this api will be called when the transaction is completed
app.post("/api/v1/payment/:uid/transaction-complete",buyEvent);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



const port = process.env.PORT || 6900;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

//connecting to database
start()
