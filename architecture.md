# LIFECHANGE Architecture

## Structure Map

```text
LIFECHANGE
|-- index.ts         -> server entry
|-- src/
|   |-- middlewares/ -> request pipeline hooks
|   |-- routers/     -> HTTP route surface
|   |-- services/    -> application logic
|   |-- repositories/-> data access
|   |-- schemas/     -> contracts and validation
|   `-- assets/      -> shared server helpers
|-- client/
|   |-- src/         -> front-end app source
|   `-- public/      -> static client assets
`-- ecosystem.config.cjs -> runtime process config
```

## Flow Map

```text
HTTP request
  -> middleware chain
  -> router selects endpoint
  -> service applies business logic
  -> repository or schema layer resolves data
  -> response returns to client app
```

## Boundaries

- Root `src/` owns backend flow and contracts.
- `client/` owns the browser-facing application.
- Environment files and build outputs are excluded.