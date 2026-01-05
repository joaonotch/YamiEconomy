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
  fs.readdirSync("./Commands").forEach(subfolder => {
    fs.readdirSync(`./Commands/${subfolder}`).forEach(file => {
      if (!file.endsWith(".js")) return;

      const filePath = path.resolve(`./Commands/${subfolder}/${file}`);
      const command = require(filePath);

      if (!command?.name) return;

      client.slashCommands.set(command.name, command);
      client.slashArray.push(command);

    });
  });

  // ===============================
  // CARREGAR EVENTOS
  // ===============================
  fs.readdirSync("./Events").forEach(subpasta => {
    fs.readdirSync(`./Events/${subpasta}`).forEach(arquivo => {
      if (!arquivo.endsWith(".js")) return;
      require(`../Events/${subpasta}/${arquivo}`);
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
