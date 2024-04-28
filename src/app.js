const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/swagger.yml');
const UserRouter = require('./modules/user');
const RepositoryRouter = require('./modules/repository');

const app = express();

// initialize swagger-jsdoc
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//  Modules Routes ----------------------------------------------
app.use(UserRouter);
app.use(RepositoryRouter);

// Server -------------------------------------------------------
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
