# @turbo-stoplight/server

[![npm version](https://badge.fury.io/js/@turbo-stoplight/vite-plugin.svg)](https://badge.fury.io/js/@turbo-stoplight/vite-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Server component for Turbo Stoplight - a tool for managing persistent Turborepo pipelines.



## Installation
```bash
# npm
npm install @turbo-stoplight/server --save-dev

# yarn
yarn add @turbo-stoplight/server --dev

# pnpm
pnpm add @turbo-stoplight/server -D
```
## Overview
Turbo Stoplight is a lightweight CLI tool for managing persistent Turborepo pipelines in a monorepo. It starts a temporary TCP server when a Turbo task is not cached, acting as a stoplight indicator for build processes. The server remains active until it receives a signal via a socket connection, providing a reliable way to control builds, monitor pipeline status, and improve CI workflows.

## Features
- Persistent pipeline management for Turborepo
- CI-friendly architecture
- Easy monitoring of pipeline status
- Optimized for monorepo workflows

## Usage

```bash
# Start the server
npx turbo-stoplight-server --task_id build --port 5005
```

### Configuration Options
The server can be configured with the following options:

```bash
npx turbo-stoplight-server --help
```



## Requirements
- Node.js 16+
- Turborepo 2.4.4 or later

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit`) and follow the prompt
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
