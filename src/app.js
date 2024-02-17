const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
// const bodyParser = require('body-parser');
// const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
// app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://nisitsolanki:9978793231@cluster0.te1decq.mongodb.net/userManagement', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
