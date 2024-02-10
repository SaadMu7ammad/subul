export default function defineRoutes(expressApp) {
    const router = express.Router();

    expressApp.use('/api/charities', router);
}
