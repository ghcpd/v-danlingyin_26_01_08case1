# Retry Utility

A simple TypeScript utility for retrying failed async operations with configurable retry limits.

## Features

- Automatic retry on promise rejection
- Configurable retry count (1-5 retries)
- Type-safe TypeScript implementation
- Simple, intuitive API

## Installation

```bash
pnpm install retry-util
```

## Usage

### Basic Example

```typescript
import { retry } from "./input"

// Define an async function that might fail
const fetchData = async () => {
  const response = await fetch('https://api.example.com/data')
  if (!response.ok) {
    throw new Error('Fetch failed')
  }
  return response.json()
}

// Retry up to 3 times on failure
retry(() => fetchData(), {
  retryCount: 3
})
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Failed after retries:', err))
```

### With Inline Function

```typescript
import { retry } from "./input"

retry(async () => {
  // Your async operation here
  const response = await fetch('https://api.example.com/data')
  return response.json()
}, {
  retryCount: 2
})
```

### Default Retry Count

If you don't specify a `retryCount`, it defaults to 3:

```typescript
import { retry } from "./input"

// Will retry up to 3 times (default)
retry(async () => {
  return await someAsyncOperation()
})
```

## API

### `retry(fn, options)`

Executes an async function with automatic retry on failure.

**Parameters:**

- `fn: () => Promise<unknown>` - The async function to execute
- `options: RetryOptions` (optional) - Configuration options
  - `retryCount?: number` - Number of retry attempts (default: 3, must be between 1 and 5)

**Returns:**

- `Promise<unknown>` - Resolves with the function's result or rejects after all retries are exhausted

**Throws:**

- `Error: "retryCount must be between 1 and 5"` - If retryCount is outside the valid range

## Constraints & Limitations

⚠️ **Important Constraints:**

1. **retryCount range:** Must be between 1 and 5 (inclusive). Values outside this range will throw an error immediately.
2. **Known bug:** The current implementation has an infinite recursion bug. When a function fails, it will retry infinitely instead of stopping after the specified retryCount. **DO NOT USE IN PRODUCTION** until this bug is fixed.

## Examples

### Valid retryCount Values

```typescript
// All of these are valid
retry(() => fetchData(), { retryCount: 1 })  // ✓ Minimum
retry(() => fetchData(), { retryCount: 3 })  // ✓ Default
retry(() => fetchData(), { retryCount: 5 })  // ✓ Maximum
```

### Invalid retryCount Values

```typescript
// These will throw an error
retry(() => fetchData(), { retryCount: 0 })  // ✗ Too low
retry(() => fetchData(), { retryCount: 6 })  // ✗ Too high
retry(() => fetchData(), { retryCount: -1 }) // ✗ Negative

// Error: "retryCount must be between 1 and 5"
```

## Error Handling

```typescript
import { retry } from "./input"

// Validate retryCount before calling
const safeRetry = async (fn, count) => {
  if (count < 1 || count > 5) {
    throw new Error('Invalid retryCount: must be between 1 and 5')
  }
  
  return retry(fn, { retryCount: count })
}

// Use with try-catch
try {
  const result = await retry(async () => {
    // Operation that might fail
    return await riskyOperation()
  }, { retryCount: 3 })
  
  console.log('Success:', result)
} catch (error) {
  console.error('All retries failed:', error)
}
```

## Known Issues

⚠️ **CRITICAL BUG:** The retry mechanism does not properly track the number of attempts. Due to a bug in the implementation (the `attempts` variable resets on each recursive call), the function will retry infinitely instead of stopping after `retryCount` attempts. This makes the library unusable for any real-world scenarios where the operation might fail.

**Workaround:** Until fixed, avoid using this library or manually limit retries by wrapping with a timeout:

```typescript
// Temporary workaround with timeout
const retryWithTimeout = (fn, options, timeoutMs = 5000) => {
  return Promise.race([
    retry(fn, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    )
  ])
}
```

## TypeScript Types

```typescript
type RetryOptions = {
  retryCount?: number  // Optional, defaults to 3, must be 1-5
}

function retry(
  fn: () => Promise<unknown>,
  options?: RetryOptions
): Promise<unknown>
```

## License

MIT

## Contributing

Please note the known issues before contributing. Priority should be given to fixing the infinite recursion bug.
