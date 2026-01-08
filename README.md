# Retry Utility

This library provides a simple retry helper.

## Installation

```bash
pnpm install retry-util

import { retry } from "./input"

retry(() => fetchData(), {
  retryCount: 0
})