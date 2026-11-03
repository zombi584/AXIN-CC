# AXIN.CC

Commercial-grade Luau source protection workbench.

## Project status

This repository starts with the web workbench scaffold. The production compiler, bytecode VM, verifier, hosted loader API, authentication, persistence, and build workers are not yet implemented. The UI must not present placeholder output as protected code.

## Planned architecture

- Next.js web application for the editor, uploads, build history, and project settings.
- Isolated build workers for parsing, transformation, verification, and packaging.
- A versioned Luau-oriented intermediate representation and bytecode format.
- A separately tested runtime/VM with explicit compatibility and resource limits.
- Signed, revocable hosted artifacts; secrets remain server-side.

## Development

Install dependencies with `npm install`, then run `npm run dev`.

See the project issues and docs as implementation progresses.
