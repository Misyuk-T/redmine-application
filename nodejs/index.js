const express = require("express");
const routes = require("./routes/routes");
const { cors } = require("./middlewares");

const PORT = 8000;

const app = express();

app.use(express.json());
app.use(cors);
app.use(routes);

const server = () =>
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });

server();

module.exports = server;
