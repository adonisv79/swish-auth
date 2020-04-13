import API from './api';
import loaders from './loaders';

const api = new API(3000);
api.on('loading', async (app) => {
  await loaders.init(app);
});
api.start();
