const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./utils/db-connection");
const singupRouter = require("./routes/singupRouter");

app.use(express.json());
app.use(cors());

const userModal = require("./modals/Users");

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.use("/users", singupRouter);

db.sync({ force: true })
  .then(() => {
    app.listen(4001, () => {
      console.log("Server is Running on http://localhost:4001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
