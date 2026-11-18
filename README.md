# Node.js Bootcamp — GitHub Day 2 and MCP Day 3

> Remote exercise: this README was updated directly on GitHub before fetching
> and pulling the change into the local repository.

A small Express application for practicing GitHub pushes, pulls, feature branches,
pull requests, forks, and issues. Day 1 is preserved in its original directory.

## Getting started

Use the Node.js version in `.nvmrc` (`nvm use`), install dependencies with
`npm install`, then run `npm start`. The ignored local `.env` uses port 8001
to avoid stopping Day 1. Without an override, the default port is 8000.

## Project structure

- `index.js` — Express application and startup.
- `routes/routes.js` — Route registration.
- `controllers/controller.js` — HTTP request handlers.
- `models/employee.js` — Mongoose employee schema.
- `test/routes.test.js` — Automated HTTP tests, run with `npm test`.
- `package.json` — Metadata, scripts, and dependencies.

## Requirements

- Node.js v22.14.0 is selected for Day 3. MongoDB MCP requires Node.js
  20.19+, 22.13+, or 24+. The older Day 2 runtime is insufficient for this tool.
- npm compatible with the selected Node.js version.
- MongoDB listening on port 27017 for the employee-list endpoint. Mongoose v8
	is used because the supplied Mongoose v9 requires a newer Node.js runtime.

Day 2 was verified with Node.js v20.10.0/npm v10.8.2; its requirements note
was committed locally and pushed after pulling the remote README edit. Day 3
uses the newer runtime already installed on this machine.

## Endpoints

- `GET /` — `You are on the root route.`
- `GET /aboutus` — `You are on the about us route.`
- `POST /addemployee` — validates and saves the employee, returning HTTP 201
	with `{ "message": "Created <name>" }`. Requires `empName` (1–100 characters)
	and `empPass` (at least 8 characters, at most 72 UTF-8 bytes).
- `GET /getemployees` — employee documents as a JSON array, without passwords.

Day 3 replaces the Day 2 POST placeholder with persistence and bcrypt hashing.
Passwords and internal database errors are never returned to clients.
An empty employee collection correctly returns `[]`, not a database error.
Only use dummy data with this training application.

## Database configuration

For Day 3 the application connects to
`mongodb://127.0.0.1:27017/employees_mcp_bootcamp`
and reads the `ftEmployees` collection. An existing MongoDB server is required;
installing Mongoose does not install MongoDB. Set `MONGODB_URI` in the process
environment or the ignored `.env` file to override the connection URL. Dotenv
loads this project's `.env` without replacing existing process variables.
Use `.env.example` for non-secret defaults; never copy credentials from the
course assets. The original `employees` database is not modified by the Day 3
seed or integration checks.

The provided model's unterminated URL string is corrected. The controller and
route consistently use `getemployees`, correcting the PDF's singular/plural
mismatch and invalid arrow-function punctuation. Queries fail promptly with HTTP
503 when the database is unavailable; internal errors and connection strings are
not returned to clients. Importing the application in tests does not connect to
MongoDB or start a fixed-port server.

## License

ISC, matching the supplied starter's package metadata.

## Remote exercises

Completed against the public repository
[mitch-infogain/git-node-d2](https://github.com/mitch-infogain/git-node-d2):

1. Initialized a fresh Day 2 repository and pushed `main`, preserving Day 1.
2. Committed the README directly on GitHub, fetched the change, observed local
	`main` behind by one commit, and pulled it with a fast-forward.
3. Edited the requirements locally, committed, and pushed back to GitHub.
4. Published `controller-feature`, created and merged
	[PR #1](https://github.com/mitch-infogain/git-node-d2/pull/1), pulled `main`,
	deleted the merged local/remote feature branches, and pruned tracking refs.
5. Added the employee model directly on GitHub, then fetched, inspected, and
	pulled the remote change.
6. Created `feature-db-access` on GitHub, committed the database changes remotely,
	reconciled the prepared local branch, and created and merged
	[PR #2](https://github.com/mitch-infogain/git-node-d2/pull/2). Pulled `main`
	and deleted/pruned the merged database branch.
7. Created [issue #3](https://github.com/mitch-infogain/git-node-d2/issues/3)
	with reproduction steps, actual results, and expected results for the
	placeholder POST endpoint. Day 3 implements the fix; no external coding agent
	was assigned. Details are also in `docs/employee-persistence-issue.md`.
8. Forked [octocat/Spoon-Knife](https://github.com/octocat/Spoon-Knife) to
	[mitch-infogain/Spoon-Knife](https://github.com/mitch-infogain/Spoon-Knife),
	cloned it beside this project, customized its page title, and configured
	`origin` for the fork and `upstream` for the original repository.

GitHub CLI and GitHub APIs were used for remote operations. The browser's file
editor failed to load, so its edit/commit workflow was performed through the API
instead. No existing repositories were deleted, and no force pushes or hard
resets were needed.

Day 2 validation: seven automated HTTP tests passed, the employee-list endpoint was
checked against the local MongoDB without inserting records or logging employee
data, and the dependency audit reports zero vulnerabilities.

## Day 3 — MCP servers and containers

See [the Day 3 setup and verification record](docs/day3-mcp.md).

- Native Copilot server definitions are in `.mcp.json`; all five servers are
	also registered in this machine's personal Copilot configuration.
- `npm test` checks the HTTP behavior; `npm run test:integration` verifies
	actual hashed persistence and removes only its own temporary record.
- `npm run seed:day3` upserts three labeled dummy employees and fictional
	linked weight data, restricted to `employees_mcp_bootcamp`.
- `npm run mcp:check` initializes the MongoDB, Git, and Docker MCP servers and
	invokes a read-only tool on each. GitHub MCP was separately verified.
- `node scripts/docker-exercise.mjs` runs the Docker MCP nginx/build exercises.
- `docker compose up -d --wait` builds/runs the app with an isolated MongoDB
	container. App: http://localhost:3001; nginx demo: http://localhost:8080.
- Import the collection and environments from `postman/` into Postman Desktop.
	Postman sign-in/cloud workspace creation is pending at the user's request.

Do not treat this unauthenticated training app as a production employee system.