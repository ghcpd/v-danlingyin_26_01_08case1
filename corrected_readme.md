# retry — usage (corrected)

A tiny helper that retries an async function.

Key points (as implemented in `input.ts`)
- Default: `retryCount = 3` (used when `options.retryCount` is omitted).
- Allowed values: integer between 1 and 5 (inclusive). Passing values outside this range throws immediately.
- The function returns the resolved value of `fn()` or rethrows the original error.

NOTE (important): the implementation contains a known bug where the retry counter is not persisted across recursive calls — see DEF-002 in `defects.txt`. Avoid using this module with functions that always reject until the bug is fixed.

API

- retry(fn, options?)
  - fn: () => Promise<T>
  - options?: { retryCount?: number } — number between 1 and 5 (default 3)

Quick examples that work with the current implementation

1) Basic (use default retryCount = 3)

```ts
import { retry } from "./input"

// resolves immediately or rejects with the underlying error
await retry(() => fetchData())
```

2) Valid override (one attempt)

```ts
import { retry } from "./input"

// retryCount must be >= 1 — this performs a single attempt
await retry(() => fetchOnce(), { retryCount: 1 })
```

3) Demonstration of a successful retry (safe example)

```ts
import { retry } from "./input"

let i = 0
await retry(() => {
  return new Promise((resolve, reject) => {
    i += 1
    if (i >= 2) resolve('ok')
    else reject(new Error('transient'))
  })
})
// resolves with 'ok' on the 2nd invocation
```

What not to do (will throw)

- Do not call with `retryCount: 0` — the implementation validates and will throw: `Error: retryCount must be between 1 and 5`.

Known limitations

- Range validation is enforced (1–5). Passing `0` or `6` will throw immediately.
- There is a known implementation bug (DEF-002) that can cause unbounded recursion when the provided `fn` keeps rejecting. Prefer providing `fn` that can eventually succeed, or patch the implementation (suggested fix in `defects.txt`).

If you want, I can open a PR that fixes the implementation and update examples to demonstrate the fixed behavior.