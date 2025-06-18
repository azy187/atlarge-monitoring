import type { ParsedReport } from "@monitoring/types/TestData";

// async function testServer() {
//   try {
//     const res = await fetch("/api/v1/data");

//     if (res.ok) {
//       const json = await res.json();
//       console.log(`Success`);
//       for (const [key, value] of Object.entries(json)) {
//         console.log(key, value);
//       }
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }

// testServer();

async function fetchReports() {
  console.log("fetchReports()");
  try {
    const res = await fetch("/api/v1/data");
    if (res.ok) {
      const json = await res.json();

      return json;
    } else {
      console.log("Failed to fetch.");
    }
  } catch (e) {
    console.log(e);
  }
}

async function init() {
  const reports = await fetchReports();
  console.log(reports);
  if (true) return;
  const { data } = reports;
  const [main] = document.getElementsByTagName("main");
  const fragment = document.createDocumentFragment();
  // fragment.appendChild(document.createElement("section")).appendChild(document.createElement("ul"));

  for (const report of data as ParsedReport[]) {
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
