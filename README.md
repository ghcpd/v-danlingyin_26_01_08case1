# Retry Utility

This library provides a simple retry helper.

## Installation

```bash
pnpm install retry-util
```

## Usage

```typescript
import { retry } from "./input"

const result = await retry(() => fetchData(), {
  retryCount: 3  // optional, default 3
})
```

## API

### `retry(fn, options?)`

Retries the given async function up to the specified number of times on failure.

#### Parameters

- `fn`: `() => Promise<unknown>` - The async function to retry. Must return a Promise.
- `options`: `RetryOptions` (optional) - Configuration object
  - `retryCount`: `number` (optional) - Number of retry attempts. Must be between 1 and 5. Default is 3.

#### Returns

`Promise<unknown>` - The resolved value of the function if successful.

#### Errors

- Throws an `Error` with message `"retryCount must be between 1 and 5"` if `retryCount` is less than 1 or greater than 5.
- Throws the original error from `fn` if all retry attempts are exhausted.