import { spawnSync } from "child_process";

function runTasks() {
  console.log("starting child process");
  const result = spawnSync("npx playwright test");
  console.log("process finished");
  console.log(`status: ${result.status}`);
}

export default runTasks;
