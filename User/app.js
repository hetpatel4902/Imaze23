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

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

//routes user
// app.get('/participants',async(req,res)=>{
//   const events = await Event.find({});
//   for(let i =0;i<events.length;i++)
//   {
//     const update = await Event.findOneAndUpdate({_id:events[i]._id},{noOfParticipants:events[i].participants.length})
//   }
//   res.status(200).json("success")
// })
app.use('/api/v1/user',userRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//populating data...
// const Event = require('./models/Event')
// const data = require('./data.json');
// const insertmany = async()=>{
//   const events = await Event.create(data);
//   console.log("success");
// }
// insertmany();

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
