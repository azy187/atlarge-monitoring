import { spawn } from "child_process";
import _test_parse from "./report-parser";

function main() {
  console.log("0. starting 'test-runner.ts'");
  console.log("1. calling 'npx playwright test'");

  const testProcess = spawn("npx playwright test");
  testProcess.on("exit", () => {
    console.log("2. calling _test_parse() from 'report-parser.ts'");
    _test_parse();
  });
}

main();
