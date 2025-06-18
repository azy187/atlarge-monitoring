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
  const reports = [];
  try {
    const res = await fetch("/api/v1/data");
    if (res.ok) {
      const json: Awaited<Readonly<{ id: number; data: ParsedReport[] }>> =
        await res.json();

      reports.push(json);
    } else {
      console.log("Failed to fetch.");
    }
  } catch (e) {
    console.log(e);
  }

  return [...reports] as const;
}

async function init() {
  const reports = await fetchReports();
  if (reports.length !== 1) return;
  const { data } = reports[0];
  const [main] = document.getElementsByTagName("main");
  const fragment = document.createDocumentFragment();
  // fragment.appendChild(document.createElement("section")).appendChild(document.createElement("ul"));

  for (const report of data) {
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
