const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const multer = require("multer")
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRouter')

const app = express();
// app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://nisitsolanki:9978793231@cluster0.te1decq.mongodb.net/userManagement', {
    // useNewUrlParser: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(multer().any())
 
// Routes
app.use('/api/users', userRoutes,adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
