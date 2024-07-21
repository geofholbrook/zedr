import express from 'express';
import { zedr } from '../src';
import supertest from 'supertest';
import z from 'zod';

describe('basic functionality (in-memory storage)', () => {
    test('should return 200 with empty array', async () => {
        const app = express();
        app.use('/', zedr(z.object({ name: z.string() })));

        const client = supertest(app);
        const response = await client.get('/');
        expect(response).toMatchObject({
            status: 200,
            body: []
        });
    });
});
