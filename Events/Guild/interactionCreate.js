const { Events } = require("discord.js");
const Discord = require("discord.js");
const client = require("../../index");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

client.on(Events.InteractionCreate, async(interaction) => {
  /* =========================
       🎯 SELECT MENU DA LOJA
    ========================== */
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId !== "shop_menu") return;

    const value = interaction.values[0];

    if (value === "vip") {
      const vipEmbed = new Discord.EmbedBuilder()
        .setTitle("💎 VIP YAMI BANK")
        .setColor("Gold")
        .setDescription(
          `👑 **Duração:** 30 dias

✨ **Benefícios**
• +10% no Daily / Work
• Badge VIP no Rank
• Coroa 👑 no Perfil

💰 **Preço**
• 35.000 Coins
• 6 YamiCoins`
        );

      const row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("buy_vip_coins")
          .setLabel("💰 Comprar com Coins")
          .setStyle(Discord.ButtonStyle.Success),

        new Discord.ButtonBuilder()
          .setCustomId("buy_vip_yami")
          .setLabel("🌸 Comprar com YamiCoins")
          .setStyle(Discord.ButtonStyle.Primary)
      );

      return interaction.update({
        embeds: [vipEmbed],
        components: [row],
      });
    }
  }

  /* =========================
       💸 BOTÕES DE COMPRA
    ========================== */
  if (interaction.isButton()) {
    const userId = interaction.user.id;

    const vipCoinsPrice = 35000;
    const vipYamiPrice = 6;

    const coins = (await db.get(`${userId}_Wallet.Coins`)) || 0;
    const yamiCoins = (await db.get(`${userId}_Wallet.YamiCoins`)) || 0;

    // Comprar com Coins
    if (interaction.customId === "buy_vip_coins") {
      if (coins < vipCoinsPrice) {
        return interaction.reply({
          content: "❌ Você não tem Coins suficientes.",
        });
      }

      await db.sub(`${userId}_Wallet.Coins`, vipCoinsPrice);
    }

    // Comprar com YamiCoins
    if (interaction.customId === "buy_vip_yami") {
      if (yamiCoins < vipYamiPrice) {
        return interaction.reply({
          content: "❌ Você não tem YamiCoins suficientes.",
        });
      }

      await db.sub(`${userId}_Wallet.YamiCoins`, vipYamiPrice);
    }

    if (
      interaction.customId !== "buy_vip_coins" &&
      interaction.customId !== "buy_vip_yami"
    )
      return;

    const vipExpire = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await db.set(`${userId}_General.VIP`, true);
    await db.set(`${userId}_General.VIPExpire`, vipExpire);

    return interaction.reply({
      content: "👑 **VIP ativado com sucesso por 30 dias!**",
    });
  }
});
