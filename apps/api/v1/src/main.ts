import app from "./app";
import dotenv from "dotenv";
import runTasks from "./utils/tasker";

dotenv.config();

app.listen(process.env.API_PORT, () => {
  const started = new Date().toLocaleTimeString();
  console.log(`[${started}] App running on port ${process.env.API_PORT}`);
  console.log(`[${started}] Attemping test run.`);
  testTasks();
});

function testTasks() {
  try {
    runTasks();
  } catch (e) {
    console.log(e);
  }
}
