import { spawnSync } from "child_process";

function main() {
  console.log("started 'test-runner.ts'");
  const result = spawnSync("npx playwright test");

  console.log(`result.output:\n${result.status}`);
  console.log(`result.status:\n${result.output}`);
}
