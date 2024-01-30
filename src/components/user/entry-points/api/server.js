import * as configurationProvider from '../../../../libraries/configuration-provider/index.js';
import configurationSchema from '../../../../config/config.js';
let connection;

const startWebServer = async () => {
    // configuration provider
    configurationProvider.initializeAndValidate(configurationSchema);
};

const stopWebServer = async () => {
    return new Promise((resolve) => {
        if (connection !== undefined) {
            connection.close(() => {
                resolve();
            });
        }
    });
};

const openConnection = async (expressApp) => {};

// ❗️Global Error Handler.
const defineErrorHandlingMiddleware = (expressApp) => {};

export { startWebServer, stopWebServer };
