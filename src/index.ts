import express from 'express';
import _ from 'lodash';
import z from 'zod';
import { IRepo } from './@types/IRepo';

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
