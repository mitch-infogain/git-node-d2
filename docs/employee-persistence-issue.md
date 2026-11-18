# POST /addemployee is a placeholder and does not persist employees

## Summary

The tutorial's employee-list controller can query MongoDB, but its POST controller
only sends a fixed message. A submitted employee never appears in the list.

## Steps to reproduce

1. Start MongoDB and run this Day 2 app with `npm start`.
2. Send `POST /addemployee` with JSON
   `{"empName":"Day2Demo","empPass":"dummy-only"}`.
3. Send `GET /getemployees`.

## Actual result

The POST returns `You are on the addemployee route`, but no new employee is
inserted. GET returns only previously existing documents, or `[]` for an empty
collection. A database outage is reported separately as HTTP 503.

## Expected result

If persistence is added, validate the input, safely hash passwords (never save or
return plaintext passwords), create the employee, and return an appropriate
status and a response that excludes the password. Add persistence and validation
tests before replacing the tutorial placeholder.

## Status

Submitted as [GitHub issue #3](https://github.com/mitch-infogain/git-node-d2/issues/3)
for the Day 2 issue exercise. Day 3 implements persistence with input validation,
bcrypt hashing, HTTP 201, and tests for JSON/form submissions and real MongoDB
storage. The integration check deletes only its own temporary employee. The
Day 3 feature commit references this issue for closure when merged into `main`.

The reproduction and actual-result sections above preserve the original Day 2
bug report; they describe the behavior before the Day 3 fix.