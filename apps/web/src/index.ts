import type { ParsedReport } from "@monitoring/types/TestData";

async function fetchReports() {
  console.log("fetchReports()");
  try {
    const res = await fetch("/api/v1/data");
    if (res.ok) {
      const json = await res.json();

      return json[0]["data"] as ParsedReport[];
    } else {
      console.log("Failed to fetch.");
    }
  } catch (e) {
    console.log(e);
  }
}

async function init() {
  const reports = await fetchReports();
  if (typeof reports === "undefined") return;
  const [main] = document.getElementsByTagName("main");
  const fragment = document.createDocumentFragment();
  // fragment.appendChild(document.createElement("section")).appendChild(document.createElement("ul"));

  for (const report of reports) {
    const header = document.createElement("h2");
    const section = document.createElement("section");
    const list = document.createElement("ul");
    header.innerText = report.internalProjectName;

    const testHistory = report.testHistory;

    for (const test of testHistory) {
      const item = list.appendChild(document.createElement("li"));
      item.innerText = `ID: ${test.id} - Start: ${new Date(
        test.time.started
      ).toLocaleTimeString()} - Passed: ${test.passed} - Failed: ${
        test.failed
      }`;
    }
    section.appendChild(header);
    section.appendChild(list);
    fragment.appendChild(section);
    main.appendChild(fragment);
  }
}

init();
