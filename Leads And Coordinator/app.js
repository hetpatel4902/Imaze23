require('dotenv').config();
require('express-async-errors');
const { StatusCodes } = require('http-status-codes')
const Event = require('./models/Event')
const UserEvent = require("./models/UserEvent")
const StaticCombo = require('./models/StaticCombo')
const Combo = require('./models/Combos')

// extra security packages
var bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const multer = require('multer')
const express = require('express');
const app = express();


app.use(bodyParser.json())


//routes import
const CoordinatorRoute = require('./routes/CoordinatorRoute')
const LeadRoute = require('./routes/LeadRoute')

//connectDB
const connectDB = require('./db/connect')

//middleware
app.use(express.static(`${__dirname}/public`));
const authMiddleware = require('./middleware/authentication')

// routers
app.use('/api/v1/coordinator',authMiddleware,CoordinatorRoute)
app.use('/api/v1/lead',authMiddleware,LeadRoute)


app.use(express.json());
app.set('trust proxy',1)
app.use(rateLimit({
  windowMs:15*60*1000, // 15 minutes
  max: 100,
}))
app.use(helmet())
app.use(cors())
app.use(xss())
// extra packages
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
//   },
// });
// const upload = multer({ storage: multerStorage })




// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.post('/api/v1/add',async (req,res)=>{
const event = await Event.create(req.body)
res.status(StatusCodes.OK).json({res:'Success',data:event})
})

app.post('/api/v1/adduserevent',async (req,res)=>{
  const event = await UserEvent.create(req.body)
  res.status(StatusCodes.OK).json({res:'Success',data:event})
})

app.post('/api/v1/addstaticcombo',async (req,res)=>{
  const event = await StaticCombo.create(req.body)
  res.status(StatusCodes.OK).json({res:'Success',data:event})
})

app.post('/api/v1/addcombo',async (req,res)=>{
  const event = await Combo.create(req.body)
  res.status(StatusCodes.OK).json({res:'Success',data:event})
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

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
