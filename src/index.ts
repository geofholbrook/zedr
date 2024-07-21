import express from 'express';
import _ from 'lodash';
import z from 'zod';

export function zedr(schema: z.ZodObject<any, any, any, any>) {
    const router = express.Router();

    router.get('/', (req, res) => {
        try {
            res.status(200).send([]);
        } catch (e) {
            res.status(500).send({ message: _.get(e, 'message', 'Unknown Error') });
        }
    });

    return router;
}
