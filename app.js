require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./utils/db-connection");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const http = require("http");
const initSocket = require("./socket");

const singupRouter = require("./routes/singupRouter");
const userRouter = require("./routes/usersRouter");
const groupRouter = require("./routes/groupsRouter");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use(morgan("combined", { stream: accessLogStream }));
const server = http.createServer(app);

initSocket(server);

const userModal = require("./modals/Users");
const MessageModal = require("./modals/Messages");
const indexModal = require("./modals/index");
const groupModal = require("./modals/Groups");
const groupMemberModal = require("./modals/GroupMembers");

// app.get("/", (req, res) => {
//   res.send("<h1>Hello World!</h1>");
// });

app.use("/users", singupRouter);
app.use("/chat", userRouter);
app.use("/groups", groupRouter);

app.use(express.static(path.join(__dirname, "build")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

db.sync({ force: true })
  .then(() => {
    app.listen(4001, () => {
      console.log("Server is Running on http://localhost:4001");
    });
  })
  .catch((err) => {
    console.log(err);
  });
