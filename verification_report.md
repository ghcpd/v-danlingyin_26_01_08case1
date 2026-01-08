# Verification Report — README vs input.ts

Summary: The README example uses `retryCount: 0` which immediately throws an error (`retryCount must be between 1 and 5`). Separately, the implementation incorrectly resets the `attempts` counter on recursion, so a function that always rejects will cause unbounded recursion and a `RangeError`.

## 1) Verify README example

Location: `README.md` — example snippet:

```md
retry(() => fetchData(), {
  retryCount: 0
})
```

Result: Fails at call site with synchronous throw.

Actual error message:
```
Error: retryCount must be between 1 and 5
```

Reproduction steps:
- Import `retry` from `input.ts` (local file).
- Call `retry(() => Promise.resolve(), { retryCount: 0 })`.
- Observed: the function throws the Error above immediately.

Code citation in `input.ts`:
- Validation and throw: lines 11-15
```ts
11: const retryCount = options.retryCount ?? 3
13: if (retryCount < 1 || retryCount > 5) {
14:   throw new Error("retryCount must be between 1 and 5")
15: }
```

Root cause: README uses `0` to indicate "no retries" but the implementation considers `0` invalid and throws. This is a documentation vs implementation mismatch.

## 2) Verify retry behavior on repeated failures

Scenario: `fn` rejects on every call (e.g., network always down).

Failing example:
```ts
retry(() => Promise.reject(new Error('fail')), { retryCount: 3 })
```

Observed error (runtime):
```
RangeError: Maximum call stack size exceeded
```

Reproduction steps:
- Import `retry` from `input.ts`.
- Call `retry(() => Promise.reject(new Error('fail')), { retryCount: 3 }).catch(console.error)`.
- Execution recurses until Node throws `RangeError`.

Code citation in `input.ts`:
- `attempts` declared and used: lines 17-25
```ts
17: let attempts = 0
19: return fn().catch(async (err) => {
20:   if (attempts >= retryCount) {
21:     throw err
22:   }
23:   attempts++
24:   return retry(fn, { retryCount })
25: })
```

Root cause: `attempts` is a local variable in each invocation of `retry`. Each recursive call reinitializes `attempts` to `0`, so `attempts >= retryCount` never becomes true; recursion continues until stack overflow.

Suggested code fixes (high-level):
- Use an iterative retry loop (for-loop) that runs up to `retryCount` attempts.
- Or pass an `attempts` parameter to recursive calls so state is preserved.

---

## Conclusion

- Documentation bug: `README.md` shows an invalid usage (`retryCount: 0`) that doesn't work with the implementation.
- Implementation bug: `attempts` not preserved across retries causing infinite recursion if the retried function never succeeds.

I have created `corrected_readme.md` (working examples and notes) and `defects.txt` (defects with reproduction steps and suggested fixes).
