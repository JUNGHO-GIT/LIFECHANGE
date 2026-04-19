# LIFECHANGE

## Overview

LIFECHANGE is a full-stack application with a root server layer and a separate
client application stored under `client/`.

## Structure

* root files such as `index.ts` and `ecosystem.config.cjs` define server entry points
* `src/` contains middleware, repositories, routers, schemas, services, and shared assets
* `client/` contains the front-end source and public assets
* package and lint configuration live at the repository root

## Notes

* Server and client code are versioned together but kept in separate trees.
* Environment and deployment-specific values are intentionally omitted.
