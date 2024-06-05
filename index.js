const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
connectToMongo();

const app = express();

app.use(express.json());
app.use(cors());

// app.get('/', (req, resp) => {
//     resp.send("hello world");
// })

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


app.listen(5000);

