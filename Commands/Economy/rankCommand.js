const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandType
} = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

function parseCoins(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value.replace(/\./g, ""));
  return 0;
}

function medal(index) {
  if (index === 0) return "👑🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `${index + 1}º`;
}

module.exports = {
  name: "rank",
  description: "Economy ・ See the ranking of users' money.",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const allData = await db.all();

    let users = allData
      .filter(i => i.id.endsWith("_Wallet"))
      .map(i => ({
        userId: i.id.replace("_Wallet", ""),
        coins: parseCoins(i.value?.Coins),
        yamiCoins: parseCoins(i.value?.YamiCoins)
      }))
      .filter(u => u.coins > 0 || u.yamiCoins > 0);

    if (!users.length) {
      return interaction.reply({
        content: "💀 Economia zerada… nem o banco acredita.",
        ephemeral: true
      });
    }

    let page = 0;
    let mode = "coins";
    const perPage = 10;

    const render = async () => {
      const sorted = [...users].sort((a, b) =>
        mode === "coins"
          ? b.coins - a.coins
          : b.yamiCoins - a.yamiCoins
      );

      const slice = sorted.slice(page * perPage, (page + 1) * perPage);
      let desc = "";

      for (let i = 0; i < slice.length; i++) {
        const pos = page * perPage + i;
        const u = slice[i];
        const user = await client.users.fetch(u.userId).catch(() => null);
        if (!user) continue;

        const valor = mode === "coins" ? u.coins : u.yamiCoins;

        desc += `${medal(pos)} | \`${user.username}\` — **${valor.toLocaleString("pt-BR")}** ${
          mode === "coins" ? "Coins 💲" : "YamiCoins 🌸"
        }\n`;
      }

      const embed = new EmbedBuilder()
        .setTitle(`🏦 YAMI BANK | RANK ${mode === "coins" ? "COINS 💲" : "YAMICOINS 🌸"}`)
        .setDescription(desc || "Vazio 🤡")
        .setColor(0x2ecc71)
        .setFooter({
          text: `Página ${page + 1}/${Math.ceil(sorted.length / perPage)}`
        })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setEmoji("⬅️")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 0),

        new ButtonBuilder()
          .setCustomId("switch")
          .setEmoji("🔄")
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId("next")
          .setEmoji("➡️")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled((page + 1) * perPage >= sorted.length)
      );

      return { embeds: [embed], components: [row] };
    };

    const msg = await interaction.reply({
      ...(await render()),
      fetchReply: true
    });

    const collector = msg.createMessageComponentCollector({
      time: 120000
    });

    collector.on("collect", async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({
          content: "🚫 Você não pode mexer no rank deste usuário!",
          ephemeral: true
        });
      }

      if (i.customId === "prev") page--;
      if (i.customId === "next") page++;
      if (i.customId === "switch") {
        page = 0;
        mode = mode === "coins" ? "yami" : "coins";
      }

      await i.update(await render());
    });
  }
};