import { vi } from 'vitest';

vi.mock('$env/static/private', () => ({
	DATABASE_URL: 'test-db-url'
}));
