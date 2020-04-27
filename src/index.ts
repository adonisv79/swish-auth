import API from './api';
import loaders from './loaders';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const api = new API(port);
api.on('loading', async (app) => {
  await loaders.init(app);
});
api.start();
