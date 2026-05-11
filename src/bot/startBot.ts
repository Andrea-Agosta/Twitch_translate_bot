import tmi from 'tmi.js';
import { createMessageHandler } from './messageHandler';

let client: tmi.Client | null = null;

export const startBot = () => {

  if (client) {
    console.log('Bot already running');
    return;
  }

  const username = process.env.TWITCH_USERNAME!;
  const oauth = process.env.TWITCH_OAUTH!;
  const channel = process.env.TWITCH_CHANNEL!;


  console.log("USERNAME:", process.env.TWITCH_USERNAME);
console.log("CHANNEL:", process.env.TWITCH_CHANNEL);
console.log("OAUTH OK:", process.env.TWITCH_OAUTH?.startsWith("oauth:"));

  client = new tmi.Client({
    options: { debug: true },
    identity: {
      username,
      password: oauth
    },
    channels: [channel]
  });

  const handler = createMessageHandler(username, client);

  client.on('message', handler);

  client.connect();

  console.log('Bot started');
}