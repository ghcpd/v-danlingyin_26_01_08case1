// Test file to verify README examples
import { retry } from "./input"

console.log("=== Test 1: README example with retryCount: 0 ===")
try {
  const fetchData = async () => {
    throw new Error("Simulated fetch error")
  }
  
  retry(() => fetchData(), {
    retryCount: 0
  })
} catch (error) {
  console.log("Error:", error)
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
  console.log("Final error after retries:", err)
  console.log("Total calls made:", callCount)
})

// Wait a bit to see if infinite recursion happens
setTimeout(() => {
  console.log("\n=== Final call count ===")
  console.log("Total calls made:", callCount)
  if (callCount > 10) {
    console.log("WARNING: Infinite recursion detected!")
  }
}, 2000)
