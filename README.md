# Node.js Starter Project — GitHub Day 2

> Remote exercise: this README was updated directly on GitHub before fetching
> and pulling the change into the local repository.

A small Express application for practicing GitHub pushes, pulls, feature branches,
pull requests, forks, and issues. Day 1 is preserved in its original directory.

## Getting started

Install dependencies with `npm install`, then run `npm start`.
The default address is http://localhost:8000. If Day 1 is still using that port,
set `PORT=8001` in your terminal before starting this project.

## Project structure

- `index.js` — Express application and startup.
- `routes/routes.js` — Route registration.
- `controllers/controller.js` — HTTP request handlers.
- `models/employee.js` — Mongoose employee schema.
- `test/routes.test.js` — Automated HTTP tests, run with `npm test`.
- `package.json` — Metadata, scripts, and dependencies.

## Requirements

- Node.js v20 or higher (a maintained LTS version is recommended).
- npm; v11 or higher is recommended with a compatible Node.js version.
	The installed Node.js v20.10/npm v10 combination also works; npm v11 requires
	a newer Node.js version, so do not upgrade npm alone on this environment.
- MongoDB listening on port 27017 for the employee-list endpoint. Mongoose v8
	is used because the supplied Mongoose v9 requires a newer Node.js runtime.

Verified locally with Node.js v20.10.0 and npm v10.8.2. This requirements note
was committed locally and pushed after pulling the remote README edit.

## Endpoints

- `GET /` — `You are on the root route.`
- `GET /aboutus` — `You are on the about us route.`
- `POST /addemployee` — `You are on the addemployee route`
- `GET /getemployees` — employee documents as a JSON array, without passwords.

The POST controller is the PDF's placeholder: it does not save employees.
An empty employee collection correctly returns `[]`, not a database error.
Only use dummy data with this training application.

## Database configuration

By default the application connects to `mongodb://127.0.0.1:27017/employees`
and reads the `ftEmployees` collection. An existing MongoDB server is required;
installing Mongoose does not install MongoDB. Set `MONGODB_URI` in the process
environment to override the connection URL. The example environment file is
documentation, not an automatically loaded configuration file.

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
	placeholder POST endpoint. The issue is intentionally open; no coding agent
	was assigned. Details are also in `docs/employee-persistence-issue.md`.
8. Forked [octocat/Spoon-Knife](https://github.com/octocat/Spoon-Knife) to
	[mitch-infogain/Spoon-Knife](https://github.com/mitch-infogain/Spoon-Knife),
	cloned it beside this project, customized its page title, and configured
	`origin` for the fork and `upstream` for the original repository.

GitHub CLI and GitHub APIs were used for remote operations. The browser's file
editor failed to load, so its edit/commit workflow was performed through the API
instead. No existing repositories were deleted, and no force pushes or hard
resets were needed.

Validation: seven automated HTTP tests pass, the employee-list endpoint was
checked against the local MongoDB without inserting records or logging employee
data, and the dependency audit reports zero vulnerabilities.