
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSE 341 Books API',
      version: '1.0.0',
      description: 'Books and Authors API documentation',
    },
    servers: [
      {
        url: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000',
        description: process.env.RENDER_EXTERNAL_URL
          ? 'Render production server'
          : 'Local development server',
      },
    ],
  },
  apis: ['./src/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
