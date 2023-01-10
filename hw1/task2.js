const fs = require("fs");
const csv = require("csvtojson");

const CONSTANTS = require("./constants");

const writeOutput = fs.createWriteStream("output.txt");
fs.createReadStream(CONSTANTS.PATH_TASK_2)
  .pipe(csv())
  .on("data", (data) => {
    writeOutput.write(data);
  })
  .on("error", (err) => {
    console.log("Stop! We have an error", err);
  })
  .on("end", () => {
    console.log("Finished");
  });
