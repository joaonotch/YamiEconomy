const client = require("../../index");
const { Events } = require('discord.js');
const chalk = require('chalk');
const Discord = require('discord.js');
const { version } = require('../../package.json')
require('dotenv').config({ quiet: true });

client.once(Events.ClientReady, () => {
  console.log(chalk.green("[SYS] Yami application started successfully!"));
  console.log(chalk.yellow(`[CMDS] Slash Commands loaded: ${client.slashCommands.size}`));
  setTimeout(() => { console.log(chalk.cyan(`[API] Successfully connected to Discord.js (${Discord.version})!`)) }, 1000)
  setTimeout(() => { console.log(chalk.magenta(`[INFO] Hello, I'm Yami, my identification code is: ${client.user.id}!`)) }, 2000)
});

client.once(Events.ClientReady, () => {
  client.user.setPresence({
    status: 'online', // online | idle | dnd | invisible
    activities: [
      {
        name: `My version is: v${version}`, // O texto que aparece
        type: Discord.ActivityType.Playing // Playing | Listening | Watching | Competing
      }
    ]
  });
})