const express = require('express');
const cors = require('cors');

const PORT = 8000

const app = express();

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});