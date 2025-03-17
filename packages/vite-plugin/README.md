# @turbo-stoplight/vite-plugin

[![npm version](https://badge.fury.io/js/@turbo-stoplight/vite-plugin.svg)](https://badge.fury.io/js/@turbo-stoplight/vite-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Vite plugin for integrating Stoplight Elements API documentation into your Vite-powered applications.

## Installation

```bash
# npm
npm install @turbo-stoplight/vite-plugin --save-dev

# yarn
yarn add @turbo-stoplight/vite-plugin --dev

# pnpm
pnpm add @turbo-stoplight/vite-plugin -D
```

## Usage

Add the plugin to your `vite.config.js` or `vite.config.ts` file:

```js
import { defineConfig } from 'vite'
import turboStoplight from '@turbo-stoplight/vite-plugin'

export default defineConfig({
  plugins: [
    turboStoplight({
      port: 5005
    })
  ]
})
```

## Configuration

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `port` | `number` | TCP port in which @turbo-stoplight/server is running | Required |

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

