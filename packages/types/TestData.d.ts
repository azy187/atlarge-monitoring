import type { JSONReportTest, JSONReport } from "@playwright/test/reporter";

type JSONReportTestAnnotationType = JSONReportTest["annotations"];

type JSONReportTestExpectedStatusType = JSONReportTest["expectedStatus"];

export type ParsedTestTime = {
  started: Date;
  ended: Date;
  elapsed: number;
};

export type ParsedTestError = {
  file: string;
  column: number;
  line: number;
  message: string;
  snippet: string;
};

export type ParsedTestResult = {
  browserProject: string;
  annotations: JSONReportTestAnnotationType;
  time: ParsedTestTime;
  status: {
    expected: JSONReportTestExpectedStatusType;
    actual: JSONReportTestExpectedStatusType;
    error: false | ParsedTestError;
  };
};

export type ParsedTestSpec = {
  title: string;
  testFile: string;
  passed: boolean;
  tests: ParsedTestResult[];
};

export type ParsedTestSuite = {
  testName: string;
  internalProjectName: string;
  passed: number;
  failed: number;
  specs: ParsedTestSpec[];
};

export type ParsedTestEntry = {
  id: number;
  suites: ParsedTestSuite[];
  passed: number;
  failed: number;
  time: ParsedTestTime;
};

export type PendingReport = JSONReport;

export type ParsedReport = {
  internalProjectName: string;
  testHistory: ParsedTestEntry[];
  lastTestTime: string;
};
