
export interface IRepo<T extends { id: number; } = { id: number; }> {
    retrieveAll: () => Promise<T[]>;
    retrieveOne: (id: number) => Promise<T | undefined>;
    create: (data: T) => Promise<T>;
    update: (patch: Partial<T>) => Promise<T>;
    delete: (id: number) => Promise<void>;
}
