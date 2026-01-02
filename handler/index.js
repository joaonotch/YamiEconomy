const fs = require("fs");
const path = require("path");
const { Events, Collection } = require("discord.js");
const chalk = require("chalk");

module.exports = async (client) => {
  client.slashCommands = new Collection();
  client.slashArray = [];

  // ===============================
  // CARREGAR SLASH COMMANDS
  // ===============================
  fs.readdirSync("./ComandosSlash").forEach(subfolder => {
    fs.readdirSync(`./ComandosSlash/${subfolder}`).forEach(file => {
      if (!file.endsWith(".js")) return;

      const filePath = path.resolve(`./ComandosSlash/${subfolder}/${file}`);
      const command = require(filePath);

      if (!command?.name) return;

      client.slashCommands.set(command.name, command);
      client.slashArray.push(command);

    });
  });

  // ===============================
  // CARREGAR EVENTOS
  // ===============================
  fs.readdirSync("./Eventos").forEach(subpasta => {
    fs.readdirSync(`./Eventos/${subpasta}`).forEach(arquivo => {
      if (!arquivo.endsWith(".js")) return;
      require(`../Eventos/${subpasta}/${arquivo}`);
    });
  });

  // ===============================
  // REGISTRAR SLASH COMMANDS
  // ===============================
  client.once(Events.ClientReady, async () => {
    client.guilds.cache.forEach(guild => {
      guild.commands.set(client.slashArray);
    });
  });
};
