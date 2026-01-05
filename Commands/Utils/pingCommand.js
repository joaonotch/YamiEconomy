const Discord = require("discord.js");

module.exports = {
  name: "ping",
  description: "Utilidades ・ Obtenha a latência do serviço da Yami!",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const ping = client.ws.ping;
    interaction.reply(`Minha latência está em **${ping}ms**`);
  }
}