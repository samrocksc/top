import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tens API',
      version: '1.0.0',
      description: 'API documentation for the Tens application',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            name: {
              type: 'string',
              nullable: true,
              description: 'User name (optional)',
            },
            auth0Id: {
              type: 'string',
              description: 'Auth0 identifier for the user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when user was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when user was last updated',
            },
          },
          required: ['id', 'email', 'auth0Id', 'createdAt', 'updatedAt'],
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            message: {
              type: 'string',
              example: 'Server is running and database is connected',
            },
          },
          required: ['status', 'message'],
        },
        HealthErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ERROR',
            },
            message: {
              type: 'string',
              example: 'Database connection failed',
            },
            error: {
              type: 'string',
              example: 'Connection timeout',
            },
          },
          required: ['status', 'message', 'error'],
        },
        UnauthenticatedResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'This is an unauthenticated endpoint',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
          },
          required: ['message', 'timestamp'],
        },
        AuthenticatedResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'This is an authenticated endpoint',
            },
            userId: {
              type: 'string',
              example: 'auth0|123456789',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
          },
          required: ['message', 'userId', 'timestamp'],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/main.ts'], // Path to the API docs
};

export default swaggerOptions;