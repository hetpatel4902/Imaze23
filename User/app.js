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
const Event = require('./models/Event');
const Cultural = require('./models/Cultural');
const FlagshipEvents = require('./models/FlagshipEvents');

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

//routes user
app.get('/populate',async(req,res)=>{
  const normla = await Event.find({});
  for(let i =0;i<normla.length;i++){
    const upd  = await Event.findOneAndUpdate({_id:normla[i]._id},{event_type:"NORMAL"});
  }
  const cult = await Cultural.find({});
  for(let i =0;i<cult.length;i++){
    const upd = await Cultural.findOneAndUpdate({_id:cult[i]._id},{event_type:"CULTURAL"})
  }
  const flag = await FlagshipEvents.find({});
  for(let i =0;i<flag.length;i++){
    const upd = await FlagshipEvents.findOneAndUpdate({_id:flag[i]._id},{event_type:"FLAGSHIP"})
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
