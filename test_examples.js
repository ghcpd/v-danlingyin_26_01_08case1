// JavaScript version for testing
function retry(fn, options = {}) {
  const retryCount = options.retryCount ?? 3

  if (retryCount < 1 || retryCount > 5) {
    throw new Error("retryCount must be between 1 and 5")
  }

  let attempts = 0

  return fn().catch(async (err) => {
    if (attempts >= retryCount) {
      throw err
    }
    attempts++
    return retry(fn, { retryCount })
  })
}

console.log("=== Test 1: README example with retryCount: 0 ===")
try {
  const fetchData = async () => {
    throw new Error("Simulated fetch error")
  }
  
  retry(() => fetchData(), {
    retryCount: 0
  })
} catch (error) {
  console.log("Error:", error.message)
}

console.log("\n=== Test 2: Valid retryCount with failure ===")
let callCount = 0
const fetchDataFailing = async () => {
  callCount++
  console.log(`Attempt ${callCount}`)
  throw new Error("Network error")
}

retry(() => fetchDataFailing(), {
  retryCount: 3
}).catch(err => {
  console.log("Final error after retries:", err.message)
  console.log("Total calls made:", callCount)
})

// Wait to check for infinite recursion
setTimeout(() => {
  console.log("\n=== Final Status ===")
  console.log("Total calls made:", callCount)
  if (callCount > 10) {
    console.log("❌ INFINITE RECURSION DETECTED!")
  }
  process.exit(0)
}, 3000)
