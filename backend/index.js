const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const path = require('path');

require('dotenv').config();
require('./utils/connectdb');

require('./strategies/JwtStrategy');
require('./strategies/LocalStrategy');
require('./authenticate');

const userRouter = require('./routes/userRoutes');
const sentenceRouter = require('./routes/sentenceRoutes');
const wordRouter = require('./routes/wordRoutes');

const app = express();

// Enable file uploads
app.use(fileUpload({
    createParentPath: true
}));

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static('uploads'));
app.use(express.static('build'));


// Add the client URL to the CORS policy
const whitelist = process.env.WHITELISTED_DOMAINS
    ? process.env.WHITELISTED_DOMAINS.split(',')
    : [];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

app.use(passport.initialize());

app.use('/user', userRouter);
app.use('/sentence', sentenceRouter);
app.use('/word', wordRouter);

app.get('/', (req, res) => {
    res.send({status: 'success'});
});


/* ----- API Calls ----- */

// Start the server in port 8081
const server = app.listen(process.env.PORT || 8081, () => {
    const port = server.address().port;
    console.log('App started at port:', port);
})