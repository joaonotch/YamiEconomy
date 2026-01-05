const Discord = require("discord.js");
const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

module.exports = {
  name: "profile",
  description: "Economy ・ View your global profile!",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const userId = interaction.user.id;

    const coins = (await db.get(`${userId}_Wallet.Coins`)) || 0;
    const yamiCoins = (await db.get(`${userId}_Wallet.YamiCoins`)) || 0;

    const vipData = await db.get(`${userId}_General`);

    let vipStatus = "❌ Não é VIP";
    let vipExpireText = "—";

    if (vipData?.VIP && vipData?.VIPExpire) {
      if (Date.now() < vipData.VIPExpire) {
        const timeLeft = vipData.VIPExpire - Date.now();
        vipStatus = "VIP+";
        vipExpireText = formatTime(timeLeft);
      } else {
        await db.set(`${userId}_General`, {
          VIP: false,
          VIPExpire: null,
        });
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("**YAMI PROFILE 👤**")
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setColor(vipStatus.includes("VIP") ? 0xf1c40f : 0x2ecc71)
      .addFields(
        {
          name: "**👤 Usuário**",
          value: `${interaction.user.username}`,
          inline: true,
        },
        { name: "**🆔 ID**", value: userId, inline: true },

        {
          name: "**💰 Coins**",
          value: `${Number(coins).toLocaleString("pt-BR")}`,
          inline: true,
        },
        {
          name: "**🌸 YamiCoins**",
          value: `${Number(yamiCoins).toLocaleString("pt-BR")}`,
          inline: true,
        },

        { name: "**💎 VIP**", value: vipStatus, inline: true },
        { name: "**⏳ Expira em**", value: vipExpireText, inline: true }
      )
      .setFooter({ text: "Perfil do Usuário" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
