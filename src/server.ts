import "dotenv/config";
import mongoose from "mongoose";
import processEnv from "./util/validateEnv";
import app from "./app";

const port = processEnv.PORT;

mongoose
  .connect(processEnv.MONGODB_CONNECTION)
  .then(() => {
    console.log("Mongoose connected");

    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch(console.error);
