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

Verified locally with Node.js v20.10.0 and npm v10.8.2. This requirements note
was committed locally and pushed after pulling the remote README edit.

## License

ISC, matching the supplied starter's package metadata.

## Remote exercises

The intended remote is `https://github.com/mitch-infogain/git-node-d2.git`.
It must be created as an empty public GitHub repository before the first push.
The original Day 1 repository must not be deleted.

GitHub authentication is needed to create the repository, edit files on the web,
create and merge pull requests, fork Spoon-Knife, and create an issue. Local
commits are not a substitute for those remote exercises.

Local branch preparation:

- `main` contains the starter and README commits.
- `controller-feature` contains the controller refactor and its tests.
- `feature-db-access` builds on the controller feature with the employee model,
  database connection, and list route.

After authentication, push `main`, then create and merge the controller PR into
`main`. Push the database branch and create its PR against the updated `main`.
Only after each PR is merged should local `main` be pulled and merged branches
deleted. No remote PRs, forks, issues, or merges are claimed by these local steps.

The web-edit/fetch/pull exercise, Spoon-Knife fork and title change, and GitHub
issue exercise still need authenticated GitHub access. A reproducible remaining
issue is documented in `docs/employee-persistence-issue.md` for submission.