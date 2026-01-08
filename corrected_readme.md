# Retry Utility

This library provides a simple retry helper.

## Installation

```bash
pnpm install retry-util
```

## Usage

```typescript
import { retry } from "./input"

// Basic usage with default retryCount (3)
await retry(() => fetchData())

// Custom retry count (must be between 1 and 5)
await retry(() => fetchData(), {
  retryCount: 3
})
```

## Important Constraints

- `retryCount` must be between **1 and 5** (inclusive)
- Using values outside this range will throw an error: `"retryCount must be between 1 and 5"`
- Default `retryCount` is **3**

## Examples

### Valid Usage

```typescript
// Using minimum retries (1)
await retry(() => apiCall(), { retryCount: 1 })

// Using maximum retries (5)
await retry(() => apiCall(), { retryCount: 5 })

// Using default (3 retries)
await retry(() => apiCall())
```

### Invalid Usage (Will Throw Error)

```typescript
// ❌ retryCount: 0 - throws error
await retry(() => apiCall(), { retryCount: 0 })

// ❌ retryCount: 6 - throws error
await retry(() => apiCall(), { retryCount: 6 })

// ❌ retryCount: -1 - throws error
await retry(() => apiCall(), { retryCount: -1 })
```

## Known Implementation Issues

⚠️ **Warning:** The current implementation has a bug where the retry limit is not properly enforced due to the `attempts` counter being reset on each recursive call. The function may retry indefinitely until the operation succeeds or until the call stack is exhausted.

This means in practice, the retry behavior may not match the specified `retryCount` parameter.
