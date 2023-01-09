import csv from "csvtojson";
import fs from "fs";
import CONSTANTS from "./constants";

const writeOutput = fs.createWriteStream("output2.txt");
const source = fs
  .createReadStream(CONSTANTS.PATH_TASK_2)
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
