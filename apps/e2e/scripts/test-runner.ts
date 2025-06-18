import { spawnSync } from "child_process";
import path from "path";
import _test_parse from "./report-parser";

function main() {
  const result = spawnSync("npx", ["playwright", "test"], {
    stdio: "inherit",
    cwd: path.resolve(__dirname),
    shell: true,
  });

  if (result.error) {
    console.error("Failed to run playwright:", result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`Playwright tests exited with code ${result.status}`);
    process.exit(result.status);
  }

  console.log("Playwright tests finished successfully");
  _test_parse();
}

main();
