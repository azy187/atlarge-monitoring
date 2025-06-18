import fs from "fs";
import path from "path";

import type {
  TestError,
  JSONReportSuite,
  JSONReportSpec,
  JSONReportTest,
  JSONReportTestResult,
} from "@playwright/test/reporter";

import type {
  ParsedTestSuite,
  ParsedTestTime,
  ParsedTestSpec,
  ParsedTestError,
  ParsedTestResult,
  ParsedReport,
  PendingReport,
} from "@monitoring/types/TestData";

import * as ANSI from "./ANSI";
import * as utils from "./index";

const PENDING_TEST_REPORT_DIR = "../../tests/reports";
const INTERNAL_PROJECT_NAMES = getInternalProjectNames();
const PENDING_TEST_REPORTS = getJSONReports();

/**
 * @returns a string[] containing the names of the projects that we are running tests for.
 *
 * The name of the project is given by the name of the subfolder containing that project's tests e.g "./playwright/tests/project_x/".
 */
function getInternalProjectNames() {
  console.log(`parser.functions path: ${__dirname}`);
  console.log(
    `parser.functions tests path: ${path.join(__dirname, "../../tests/")}`
  );
  const internalProjectNames = fs
    .readdirSync(path.join(__dirname, "../../tests/"))
    .filter((folder) => folder !== "reports" && folder !== "results");

  return internalProjectNames;
}

/**
 * @returns Array<PendingReport | ParsedReport>
 */
function getJSONReports() {
  console.log(`getJSONReports()`);
  const reports = fs
    .readdirSync(path.join(__dirname, PENDING_TEST_REPORT_DIR))
    .filter((report) => path.extname(report) === ".json")
    .map((filePath) => {
      console.log(`filePath: ${filePath}`);
      const data = fs.readFileSync(filePath);
      return JSON.parse(data.toString());
    });
  console.log(`reports.length: ${reports.length}`);

  return reports as PendingReport[];
}

/**
 * @param startTimeStr The time that the test started in ISO 8601 format
 * @param elapsedTime How long it took for the test to complete in ms
 * @returns object containing the time the test started, ended, and time it took to complete.
 */
function formatTime(startTime: string, elapsed: number): ParsedTestTime {
  const started = new Date(startTime);
  const ended = new Date(startTime);
  ended.setMilliseconds(started.getMilliseconds() + elapsed);

  return {
    started,
    ended,
    elapsed,
  } as const;
}

/**
 * @returns ParsedTestError | false if the test did not throw
 */
function formatErrors(testData: JSONReportTestResult): false | ParsedTestError {
  if (testData.error) {
    const {
      message,
      snippet,
      location: { file, column, line },
    } = testData.error as Required<TestError>;

    return {
      file,
      column,
      line,
      message: ANSI.convertToStyledHTML(message),
      snippet: ANSI.convertToStyledHTML(snippet),
    };
  } else {
    return false;
  }
}

function parseTestSpec({ title, ok, tests, file }: JSONReportSpec) {
  const parsedTests = parseTests(tests);
  const [_, testFile] = utils.getTestNameAndProjectFolderName(file);

  return {
    title,
    testFile,
    passed: ok,
    tests: parsedTests,
  } as const satisfies ParsedTestSpec;
}

function parseTests(testData: JSONReportTest[]) {
  const tests = [...testData].map((test) => {
    const [result] = test.results;

    return {
      browserProject: test.projectName,
      annotations: test.annotations,
      time: formatTime(result.startTime, result.duration),
      status: {
        expected: test.expectedStatus,
        actual: result.status!,
        error: formatErrors(result),
      },
    } as const satisfies ParsedTestResult;
  });

  return tests;
}

function parseTestSuite(suite: JSONReportSuite) {
  const [internalProjectName, testFile] = utils.getTestNameAndProjectFolderName(
    suite.file
  );
  let passed = 0;
  let failed = 0;
  const [testName] = testFile.split(".spec.ts");
  const specs = [...suite.specs].map((spec) => {
    const parsedSpec = parseTestSpec(spec);

    if (parsedSpec.passed) {
      passed += 1;
    } else {
      failed += 1;
    }

    return parsedSpec;
  });

  return {
    testName,
    internalProjectName,
    passed,
    failed,
    specs,
  } as const satisfies ParsedTestSuite;
}

function parsePendingReports(historical: ParsedReport[]) {
  const parsedSuites: ParsedTestSuite[] = [];
  const internalProjects: ParsedReport[] = [];

  if (PENDING_TEST_REPORTS.length) {
    for (const report of PENDING_TEST_REPORTS) {
      const { startTime, duration, expected, unexpected } = report.stats;

      for (const suite of report.suites) {
        const parsedSuite = parseTestSuite(suite);

        parsedSuites.push(parsedSuite);
      }

      for (const internalProject of INTERNAL_PROJECT_NAMES) {
        const projectSuites = parsedSuites.filter(
          (suite) => suite.internalProjectName === internalProject
        );

        let passed = 0;
        let failed = 0;

        projectSuites.forEach((suite) => {
          passed += suite.passed;
          failed += suite.failed;
        });

        const testHistory = [
          {
            id: 0,
            suites: projectSuites,
            passed,
            failed,
            time: formatTime(startTime, duration),
          },
        ];

        const previousProjectReport = historical.filter(
          (t) =>
            t.internalProjectName === internalProject &&
            t.lastTestTime !== startTime
        );

        if (previousProjectReport.length) {
          const [report] = previousProjectReport;

          testHistory.push(...report.testHistory);
        }

        internalProjects.push({
          internalProjectName: internalProject,
          lastTestTime: startTime,
          testHistory: testHistory.map((test, idx) => ({
            ...test,
            id: idx,
          })),
        });
      }
    }
  }

  return internalProjects;
}

export { parsePendingReports };
