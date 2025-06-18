import type { PendingReport } from "@monitoring/types/TestData";

async function testServer() {
  try {
    const res = await fetch("/api/v1/data");

    if (res.ok) {
      const json = await res.json();
      console.log(`Success`);
      for (const [key, value] of Object.entries(json)) {
        console.log(key, value);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

testServer();
