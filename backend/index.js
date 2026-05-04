require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/db/db");

connectToDB();

app.listen(process.env.PORT, () => {
  console.log(
    `Application is running on : http://localhost:${process.env.PORT}`,
  );
});
