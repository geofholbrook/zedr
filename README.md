# ZEDR

NPM package for CRUD routes! For the moment, using zod, express, and in-memory storage only.

## usage

Zod schemas are part of the zedr API ... we want validation out of the box.

_N.B. this is a first draft_

```typescript
import express from 'express';
import { InMemoryRepo, zedr } from '../src';
import z from 'zod';

// decide what an record looks like
const schema = z.object({
    id: z.number().optional() // this could be automatically added maybe
    name: z.string(),
    age: z.number()
})

// make a place to put the records
const repository: new InMemoryRepo();

// make your express app
const app = express();

// add the routes, presto!
app.use('/people', zedr({repository, schema}));
```

## Roadmap

-   support for
    -   other server frameworks
    -   other persistence models
        -   SQL
        -   file system
    -   other validators
        -   ajv
