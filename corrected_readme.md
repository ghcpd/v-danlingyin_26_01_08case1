# Retry Utility (Corrected Documentation)

This library provides a simple retry helper.

## Installation

```bash
pnpm install retry-util
```

## Usage

```ts
import { retry } from "./input"

async function fetchData() {
  // Example API call that succeeds
  return "ok"
}

// Simple usage (uses default retry count = 3)
await retry(() => fetchData())
```

## Options

- `retryCount` (optional): number — **allowed range: 1 through 5**. Default: `3`.
  - Passing a value outside this range will throw: `Error("retryCount must be between 1 and 5")`.

## Important notes & edge cases

- Do not pass `retryCount: 0` (example in older docs) — that is invalid and will cause `retry` to throw immediately.

- Known implementation issue: when `fn` **always rejects**, the current implementation repeatedly retries and does not stop as expected — this is a bug in `input.ts`. See `defects.txt` for details and a suggested fix.

- Recommended pattern while the bug is open: ensure the retried function can succeed eventually, or avoid relying on `retry` for persistent failures.

## Suggested fix (for maintainers)

Replace the recursive implementation (which resets a local `attempts` counter on each call) with a loop or an internal helper that preserves attempt count. Example (safe implementation):

```ts
export async function retry(fn: () => Promise<unknown>, options = { retryCount: 3 }) {
  const retryCount = options.retryCount ?? 3
  if (retryCount < 1 || retryCount > 5) throw new Error("retryCount must be between 1 and 5")

  let attempts = 0
  while (true) {
    try {
      return await fn()
    } catch (err) {
      attempts++
      if (attempts >= retryCount) throw err
    }
  }
}
```

This ensures the `attempts` counter persists across retries and stops after the configured number.
