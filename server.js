const http = require('http');
const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const Router = require('koa-router');

const app = new Koa();

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const dirPublic = path.join(__dirname, '/public');
app.use(koaStatic(dirPublic));

const router = new Router();
app.use(router.routes()).use(router.allowedMethods());

const messages = [
  {
    id: 1,
    userId: '5f2d9da0-f624-4309-a598-8ba35d6c4bb6',
    content: 'Какая сейчас погода за окном?',
  },
  {
    id: 2,
    userId: '5f2d9da0-f624-4309-a598-8ba35d6c4bb6',
    content: 'К сожалению, я не знаю ответа на этот вопрос',
  },
];

let nextId = 3;

router.get('/messages', async (ctx) => {
  const from = Number(ctx.request.query.from);
  if (ctx.request.query.from === 0) {
    ctx.response.body = JSON.stringify(messages);
    return;
  }

  const fromIndex = messages.findIndex((o) => o.id === from);
  if (fromIndex === -1) {
    ctx.response.body = JSON.stringify(messages);
    return;
  }

  ctx.response.body = JSON.stringify(messages.slice(fromIndex + 1));
});

router.post('/messages', async (ctx) => {
  messages.push({ ...JSON.parse(ctx.request.body), id: nextId += 1 });

  ctx.response.body = JSON.stringify({
    success: true,
    result: 'Сообщение успешно добавлено',
  });
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
// eslint-disable-next-line no-console
server.listen(port, () => console.log('Server started'));
