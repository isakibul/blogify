require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connectDatabase } = require("./db/index");

const server = http.createServer(app);

const port = process.env.PORT || 4000;

const main = async () => {
  try {
    await connectDatabase();
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (e) {
    console.log("Database error");
    console.log(e);
  }
};

main();
