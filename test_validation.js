// Test validation error with retryCount: 0
function retry(fn, options = {}) {
  const retryCount = options.retryCount ?? 3

  if (retryCount < 1 || retryCount > 5) {
    throw new Error("retryCount must be between 1 and 5")
  }
}

console.log("=== Test: README example with retryCount: 0 ===")
try {
  retry(() => Promise.resolve(), { retryCount: 0 })
  console.log("✓ No error thrown (unexpected)")
} catch (error) {
  console.log("✗ Error thrown:", error.message)
  console.log("Stack:", error.stack)
}
