const env = require('./config/env');
const createApp = require('./app');

const app = createApp();
app.listen(env.port, () => {
  console.log(`[tabienselect] API listening on http://localhost:${env.port}`);
});
