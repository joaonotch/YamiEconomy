const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ApplicationCommandType
} = require("discord.js");

module.exports = {
  name: "shop",
  description: "Economy ・ Loja do YAMI BANK",
  type: ApplicationCommandType.ChatInput,

  async run(client, interaction) {

    const embed = new EmbedBuilder()
      .setTitle("🛒 YAMI SHOP")
      .setColor("Green")
      .setDescription(
        "Escolha um produto no menu abaixo 👇\n\n" +
        "💎 VIP+ — benefícios exclusivos"
      );

    const menu = new StringSelectMenuBuilder()
      .setCustomId("shop_menu") // ⚠️ TEM QUE SER ESSE
      .setPlaceholder("Selecione um produto")
      .addOptions([
        {
          label: "VIP+",
          description: "Benefícios exclusivos",
          value: "vip",
          emoji: "💎"
        }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
