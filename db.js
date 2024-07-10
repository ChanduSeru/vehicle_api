const mongoose = require('mongoose');

mongoose
  .connect('mongodb://127.0.0.1:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  pass: {
    type: String,
    required: true
  }
});

const auth = mongoose.model('auth', authSchema, 'creds'); // 'creds' is the collection name

module.exports = auth;
