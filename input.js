"use strict";
// input.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = retry;
function retry(fn, options = {}) {
    const retryCount = options.retryCount ?? 3;
    if (retryCount < 1 || retryCount > 5) {
        throw new Error("retryCount must be between 1 and 5");
    }
    let attempts = 0;
    return fn().catch(async (err) => {
        if (attempts >= retryCount) {
            throw err;
        }
        attempts++;
        return retry(fn, { retryCount });
    });
}
