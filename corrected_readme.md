# Retry Utility (Corrected Usage)

This library provides a simple retry helper.

## Installation

Install the package in your project (example uses local file import in this repo):

```bash
# If this were published: pnpm install retry-util
# For local testing, import from the local file
import { retry } from "./input"
```

## API

`retry(fn, options?)`
- `fn`: a function that returns a `Promise`.
- `options.retryCount` (optional): number of attempts **allowed** (must be an integer between **1** and **5**, default is **3**).

> Note: The current implementation throws an error if `retryCount` is less than 1 or greater than 5.

## Examples (working)

1) Default behavior (up to 3 attempts):

```ts
import { retry } from "./input"

let calls = 0
async function flaky() {
  calls++
  if (calls < 2) {
    // fail the first call, succeed the second
    return Promise.reject(new Error('temporary failure'))
  }
  return Promise.resolve('ok')
}

retry(() => flaky()).then(console.log).catch(console.error)
// -> prints 'ok'
```

2) Explicit valid `retryCount`:

```ts
// will attempt up to 5 attempts (if necessary). Allowed range: 1..5
retry(() => flaky(), { retryCount: 5 })
```

## Constraints & Edge Cases

- `retryCount` must be between **1** and **5**; otherwise the function throws synchronously with the message:

```
Error: retryCount must be between 1 and 5
```

- Current implementation has a bug: the internal `attempts` counter is reset on each recursive call. If `fn` keeps rejecting, this leads to unbounded recursion and eventually a runtime `RangeError: Maximum call stack size exceeded` in Node.js. Avoid passing a function that always rejects; ensure your function will eventually succeed within the allowed attempts.

- Recommended usage: make sure the retried operation is idempotent and will succeed within a small number of retries.

## Troubleshooting

- If you see `Error: retryCount must be between 1 and 5` — you're using an invalid `retryCount` (e.g., `0`). Use `1` to attempt exactly once (no retries), or a number in `1..5` to allow retries.

- If you see `RangeError: Maximum call stack size exceeded` — the implementation incorrectly resets the attempt counter and recurses until the stack overflows; see defects list for a suggested fix.
