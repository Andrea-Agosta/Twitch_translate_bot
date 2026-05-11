import express from 'express';
import { startBot } from './bot/startBot';

const app = express();

app.use(express.json());
startBot();

// TODO: future Upgrade

// app.get('/', (_req, res) => {
//   res.send('Twitch Translator Bot is running 🚀');
// });

// app.post('/start-bot', (_req, res) => {
//   startBot();
//   res.json({ status: 'bot started' });
// });

// app.get('/status', (_req, res) => {
//   res.json({ status: 'ok', bot: 'running' });
// });

export default app;