import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8000/openapi.json',
  output: 'src/types',
  client: {
    name: 'fetch',
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  }
});