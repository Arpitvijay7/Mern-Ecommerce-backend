const { log } = require("console");
const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Handling uncaught exceptions
process.on("uncaughtException",(err) => {
   console.log(`Error: ${err.message}`);
   console.log("Shutting down the server due to uncaughtException ");

   process.exit(1);
    
})

// Config
dotenv.config({ path: "backend/config/config.env" });

// database connecting
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});

// unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1);
    })
})