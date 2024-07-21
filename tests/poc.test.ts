import express from 'express';
import { InMemoryRepo, zedr } from '../src';
import supertest from 'supertest';
import z from 'zod';

describe('basic functionality (in-memory storage)', () => {
    const app = express();
    app.use(
        '/',
        zedr({
            repository: new InMemoryRepo(),
            schema: z.object({ id: z.number().optional(), name: z.string() })
        })
    );

    const client = supertest(app);

    test('should return 200 with empty array', async () => {
        const response = await client.get('/');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject([]);
    });

    test('should create and fetch an entity (fetch all)', async () => {
        const response = await client.post('/').send({ name: 'foo' });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ name: 'foo' });

        const id = response.body.id;
        const fetchResponse = await client.get('/');
        expect(fetchResponse.status).toBe(200);
        expect(fetchResponse.body).toHaveLength(1);
        expect(fetchResponse.body[0]).toMatchObject({ name: 'foo' });
    });

    test('should create and fetch an entity (fetch by id)', async () => {
        const response = await client.post('/').send({ name: 'foo' });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ name: 'foo' });

        const id = response.body.id;
        const fetchResponse = await client.get(`/${id}`);
        
        expect(fetchResponse.status).toBe(200);
        expect(fetchResponse.body).toMatchObject({ id, name: 'foo' });
    });
});
