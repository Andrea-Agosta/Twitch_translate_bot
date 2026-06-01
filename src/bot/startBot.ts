import tmi from 'tmi.js'
import { createMessageHandler } from './messageHandler'

let client: tmi.Client | null = null

export const startBot = () => {

  if (client) {
    console.log('Bot already running')
    return
  }

  const username = process.env.TWITCH_USERNAME!
  const oauth = process.env.TWITCH_OAUTH!
  const channel = process.env.TWITCH_CHANNEL!

  client = new tmi.Client({
    options: { debug: true },
    identity: {
      username,
      password: oauth
    },
    channels: [channel, "violetwitchplayer"]
  })

  const handler = createMessageHandler(username, client)

  client.on('message', handler)

  client.connect()

  console.log('Bot started')
}