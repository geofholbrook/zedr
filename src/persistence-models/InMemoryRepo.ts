import { IRepo } from '../@types';

export class InMemoryRepo<T extends { id: number; }> implements IRepo<T> {
    private records: T[] = [];
    private sequence = 0;

    async retrieveAll() {
        return this.records;
    }

    async retrieveOne(id: number) {
        return this.records.find(r => r.id === id);
    }

    async create(data: T) {
        const newRecord = { ...data, id: ++this.sequence };
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
