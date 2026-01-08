// test.ts
const { retry } = require("./input")

async function fetchData() {
  throw new Error("Simulated failure");
}

async function main() {
  try {
    const result = await retry(() => fetchData(), { retryCount: 3 });
    console.log("Success:", result);
  } catch (err) {
    console.log("Error:", err);
  }
}

main();