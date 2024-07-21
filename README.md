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

// make your express app
const app = express();




```

## Roadmap

* support for 
    * other server frameworks
    * other persistence models 
        * SQL
        * file system
    * other validators
        * ajv
