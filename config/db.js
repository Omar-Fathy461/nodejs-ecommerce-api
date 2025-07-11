const mongoose = require('mongoose');
const url = process.env.MONGOO_URL;

mongoose.connect(url)
.then(() => console.log("database connected..."))
.catch((err) => console.log("Error Connecting to database:", err));