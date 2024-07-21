import express from 'express';
import _ from 'lodash';
import z from 'zod';

interface IRepo<T extends { id: number } = { id: number }> {
    retrieveAll: () => Promise<T[]>;
    retrieveOne: (id: number) => Promise<T>;
    create: (data: T) => Promise<T>;
    update: (patch: Partial<T>) => Promise<T>;
    delete: (id: number) => Promise<void>;
}

export class InMemoryRepo<T extends { id: number }> implements IRepo<T> {
    private data: T[] = [];
    private sequence = 0;

    async retrieveAll() {
        return this.data;
    }

    async retrieveOne(id: number) {
        return this.data[Number(id)];
    }

    async create(data: T) {
        const newEntry = { ...data, id: ++this.sequence }
        this.data.push(newEntry);
        return newEntry;
    }

    async update(patch: Partial<T>) {
        return patch as T;
    }

    async delete(id: number) {
        this.data.splice(Number(id), 1);
    }
}

export function zedr(options: { repository: IRepo; schema: z.ZodObject<any, any, any, any> }) {
    const router = express.Router();
    router.use(express.json());
    router.post('/', async (req, res) => {
        try {
            const entity = options.schema.parse(req.body);
            const created = await options.repository.create(entity);
            res.status(200).send(created);
        } catch (e) {
            res.status(500).send({ message: _.get(e, 'message', 'Unknown Error') });
        }
    });

    router.get('/', async (req, res) => {
        try {
            const entries = await options.repository.retrieveAll();
            res.status(200).send(entries);
        } catch (e) {
            res.status(500).send({ message: _.get(e, 'message', 'Unknown Error') });
        }
    });

    return router;
}
