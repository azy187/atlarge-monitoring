import { execSync } from "child_process";

function main() {
  console.log("started 'test-runner.ts'");
  const result = execSync("npx playwright test");

  console.log(`result:\n${result}`);
}

main();
