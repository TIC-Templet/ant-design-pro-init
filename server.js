const express = require('express'); // 服务
const compression = require('compression'); // gzip
const path = require('path');

const app = express();
const port = process.env.PORT || 9001;
app.use(compression());
app.use(express.static(`${__dirname}/dist`));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/dist/index.html`));
});
app.listen(port, () => {
  console.log(`已经启动服务：127.0.0.1:${port}`);
});
