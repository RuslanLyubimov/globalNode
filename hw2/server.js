const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/users", userRoutes);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server is working!");
});
