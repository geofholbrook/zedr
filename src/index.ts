import express from 'express';
import _ from 'lodash';
import z from 'zod';

interface IRepo<T extends { id: number } = { id: number }> {
    retrieveAll: () => Promise<T[]>;
    retrieveOne: (id: number) => Promise<T | undefined>;
    create: (data: T) => Promise<T>;
    update: (patch: Partial<T>) => Promise<T>;
    delete: (id: number) => Promise<void>;
}

export class InMemoryRepo<T extends { id: number }> implements IRepo<T> {
    private records: T[] = [];
    private sequence = 0;

    async retrieveAll() {
        return this.records;
    }

    async retrieveOne(id: number) {
        return this.records.find(r => r.id === id);
    }

    async create(data: T) {
        const newRecord = { ...data, id: ++this.sequence }
        this.records.push(newRecord);
        return newRecord;
    }

    async update(patch: Partial<T>) {
        return patch as T;
    }

    async delete(id: number) {
        this.records.splice(Number(id), 1);
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
            const records = await options.repository.retrieveAll();
            res.status(200).send(records);
        } catch (e) {
            res.status(500).send({ message: _.get(e, 'message', 'Unknown Error') });
        }
    });

    router.get('/:id', async (req, res) => {
        const id = Number(req.params.id);
        try {
            const record = await options.repository.retrieveOne(id);
            if (!record) {
                res.status(404).send({ message: 'Not Found' });
            }
            res.status(200).send(record);
        } catch (e) {
            res.status(500).send({ message: _.get(e, 'message', 'Unknown Error') });
        }
    });

    return router;
}
