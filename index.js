const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to Book API');
})

app.listen(4000,()=> {
    console.log('listening on http://localhost:4000');
})