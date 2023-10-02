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
const authmiddleware = require('./middleware/authmiddleware')

// routers
const userRouter =  require('./routes/userRouter')


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const Users = require('./models/Users');

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

let enr = "12002080501000"
//routes user
app.get('/populate',async(req,res)=>{
  const users = await Users.find({});
  for(let i =0;i<users.length;i++){
    const upd = await Users.findOneandUpdate({_id:users._id},{enrolment:enr+1,branch:"IT",year:"4"})
  }
  res.status(200).json("success");
})
app.use('/api/v1/user',userRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

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
