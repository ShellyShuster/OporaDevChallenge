
import { Pool } from 'pg';

export default new Pool ({
    max: 20,
    connectionString: 'postgres://postgres:123456@localhost:5432/Drivers',
    idleTimeoutMillis: 30000
});