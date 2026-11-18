# Day 3 — MCP setup and exercises

## Scope and safety

Continues the existing Day 2 repository on `add-new-employee`. Existing Git
history and GitHub repositories are preserved; the guide's deletion/recreation
step is not necessary to learn MCP and was not performed. Day 1 remains separate.

Some supplied examples contain literal credentials and malformed JSON. No
credentials from those files were copied or used. If any supplied credentials
are real and belong to you, revoke/rotate them. Never paste secrets into chat.

The training API is unauthenticated: bind it locally and use dummy records only.
Docker's socket grants powerful host access; approve Docker tools individually.
No privileged containers, public database ports, global auto-approval changes,
or Docker group/sudo changes are required on this machine.

## Configuration and runtime

This VS Code installation supports the native Copilot MCP format. `.mcp.json`
uses `mcpServers`, not the course's older `.vscode/mcp.json` `servers` schema.
Do not duplicate these definitions into both formats. The same five servers
are registered in the personal native configuration at
`~/.copilot/mcp-config.json`, with absolute local executable/script paths so
they work even while another workspace is open. Native root configuration
assumes the project root is the working directory.

Restart the chat session or reload MCP configuration to discover newly added
servers. Review server trust and sign-in requests. A configuration file by
itself is not proof that a server is connected to a VS Code session.

| Server | Configuration | Verification |
| --- | --- | --- |
| GitHub | Official `https://api.githubcopilot.com/mcp/`, browser OAuth | MCP initialize, tools/list, and get_me passed using the existing GitHub CLI credential in memory; no token saved or printed |
| MongoDB | Pinned local npm package, Node.js 22, ignored environment file | MCP initialize, tools/list, and list-collections passed |
| Git | Python `mcp-server-git==2026.11.18`, repository scoped launcher | MCP initialize, tools/list, and git_status passed |
| Docker | Python `mcp-server-docker==0.3.0`, local Unix socket | MCP initialize, tools/list, list_containers, pull_image, run_container, and build_image passed |
| Postman | Official OAuth endpoint `https://mcp.postman.com/minimal` | Configured only; sign-in and remote workspace/collection/environment creation remain pending at the user's request |

Node.js 22.14.0 was already installed and is selected in `.nvmrc`. The MCP
launcher can find it even if VS Code inherited the older Node.js 20.10 PATH.
UV, Python 3.12, Git/Docker MCP executables, and Docker Compose were installed
under the user's account, with no administrator privileges. The official
Compose binary was checked against its published SHA-256 checksum.

The latest local Postman package introduced vulnerable transitive dependencies,
so this setup uses Postman's recommended remote OAuth service instead. MongoDB
MCP is pinned to 3.3.0 with a `basic-ftp` override to patched version 6.2.6;
its direct MongoDB MCP connection and tools were then tested. `npm audit`
reports no known vulnerabilities in this installed dependency tree. Review the
override and rerun protocol tests when upgrading upstream packages.

## Employee persistence and environment

`POST /addemployee` now validates the request, hashes the password with bcrypt
(cost 12), inserts the employee, and returns HTTP 201 with a creation message.
JSON and URL-encoded inputs are supported. Names are trimmed, password lengths
are checked before bcrypt's 72-byte boundary, and database failures return
generic HTTP 503/500 errors rather than internal messages or credentials.

`.env` is ignored by Git and excluded from Docker builds. Its local values use
port 8001 and database `employees_mcp_bootcamp`, avoiding the existing Day 1
server and the Day 2 `employees` database. `.env.example` is safe to commit.
The launcher loads environment variables with Dotenv instead of sourcing a
shell script, which avoids executing commands from the environment file.

MongoDB MCP is read-only by default. Write access was enabled only for one
short-lived verification process, updating timestamps with this restriction:

- Database: `employees_mcp_bootcamp`
- Collection: `ftEmployees`
- Filter: `{ "bootcamp": "day3" }`
- Update: `{ "$currentDate": { "timestamp": true } }`

That process was closed afterward; normal configuration remains read-only.
The guide varies between `employeeDB`, `employees`, `ft_employees`, and
`ftEmployees`. This project consistently uses the training database above and
`ftEmployees`, matching the application's schema.

`npm run seed:day3` prepares labeled Joe, Mary, and Bob dummy documents, adds
timestamps, and associates a fictional weight/date with Bob's `_id` in
`employee_weights`. All passwords are hashes rather than the guide's plaintext
examples. The seed is repeatable and refuses to operate in another database.
Optional bulk exports and collection merges were not run.

## Postman handoff

The user's sign-in page was opened, but authentication was deferred. No
Postman cloud workspace, collection, or environment is claimed as created.

Ready-to-import files:

- `postman/day3.postman_collection.json` — all four routes and response tests.
- `postman/local.postman_environment.json` — `baseUrl=http://localhost:8001`.
- `postman/docker.postman_environment.json` — `baseUrl=http://localhost:3001`.

After signing in, authenticate the Postman MCP server and create a personal
workspace named `bootcamp`. Import/upload the collection and environment there,
or ask its tools to create them from these files. Choose the Local or Docker
environment as appropriate. The collection's POST request intentionally creates
a dummy employee; repeated runs add more dummy records.

The remote Postman server cannot reach your workstation's localhost endpoints.
Run the requests in Postman Desktop or through the Desktop Agent. There is no
need to publish localhost or use an untrusted public tunnel.

## Docker

The Docker MCP server pulled `nginx:alpine`, ran `mcp-test-nginx` bound to
`127.0.0.1:8080`, and built `my-node-app:day3` from the application Dockerfile.
The Node image runs as a non-root user and installs production dependencies
only; neither credentials nor the environment file are copied into it.

Compose runs the app at `127.0.0.1:3001` mapped to container port 8000 and
connects it to `mongo:27017` inside a private Compose network. MongoDB has no
published host port. This avoids the course's localhost/host-gateway confusion
and does not change the existing host MongoDB bind address.

The app and MongoDB have health checks. `docker compose up -d --wait` starts
the stack; `docker compose down` stops it while retaining its named database
volume. Remove the named volume only if you intend to delete that training data.
The separate nginx demo can be stopped with `docker stop mcp-test-nginx`.

## Verification

- `npm test`: eleven automated HTTP/configuration tests passed.
- `npm run test:integration`: actual create/list, hashed persistence, password
  exclusion, and cleanup of the temporary record passed against host MongoDB.
- `npm run mcp:check`: three local MCP handshakes and read-only tool calls passed.
- GitHub MCP handshake and get_me passed separately without logging credentials.
- A scoped MongoDB MCP write passed; configured access remains read-only.
- Docker MCP nginx pull/run and Node image build passed.
- Nginx root, containerized app root, and the container employee-list endpoint
  responded successfully.
- `npm audit`: zero known vulnerabilities.

Postman OAuth and its cloud exercises remain explicitly pending.

## Official references

- [VS Code MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration)
- [GitHub MCP server](https://github.com/github/github-mcp-server)
- [MongoDB MCP server](https://github.com/mongodb-js/mongodb-mcp-server)
- [Postman MCP server](https://github.com/postmanlabs/postman-mcp-server)
- [Docker MCP server](https://github.com/ckreiling/mcp-server-docker)