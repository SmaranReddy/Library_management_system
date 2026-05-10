# Dependency Documentation

## Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **express** | ^4.21.2 | Web framework for building the REST API — handles routing, middleware, request/response lifecycle |
| **mongoose** | ^8.9.5 | MongoDB ODM — provides schema-based data modeling, validation, query building, and connection management |
| **dotenv** | ^16.4.7 | Loads environment variables from `.env` into `process.env` for configuration (port, DB URI, environment mode) |

## Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **nodemon** | ^3.1.14 | Auto-restarts the Node.js process when file changes are detected during development |

## Usage Notes

- `express.json()` and `express.urlencoded()` body parsers are used — no additional parsing library is required.
- Validation is performed manually in controller logic (not via `express-validator`). The existing validation approach is self-contained and does not introduce an extra dependency.
- All three production packages are imported and used directly in source files. No unused dependencies exist.
