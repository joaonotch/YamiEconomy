const Discord = require("discord.js");
const { formatNumber } = require('../../Eventos/Client/format');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: 'daily',
    description: 'Economy ・ Receive your daily reward!',
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000; // 24h
        const dailyAmount = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000; // 4000 - 7000

        // cooldown
        const lastDaily = await db.get(`${interaction.user.id}_General.DailyYami`);

        if (lastDaily && now - lastDaily < cooldown) {
            const timeLeft = cooldown - (now - lastDaily);
            const hours = Math.floor(timeLeft / 3600000);
            const minutes = Math.floor((timeLeft % 3600000) / 60000);

            const cooldownEmbed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setTitle("⏳ Daily indisponível")
                .setDescription(
                    `Segura a ansiedade 😭\nVolta em **${hours}h ${minutes}min** pra pegar outro daily.`
                );

            return interaction.reply({
                embeds: [cooldownEmbed],
                ephemeral: true
            });
        }

        // lógica do premium
        let premiumReward = 0;

        if (Math.random() <= 0.05) { // 5% de chance de evento premium
            const roll = Math.random();

            if (roll <= 0.4) {
                premiumReward = 2; // 40%
            } else if (roll <= 0.6) {
                premiumReward = 5; // 20%
            }
            // 40% restante = nada
        }

        await db.add(`${interaction.user.id}_Wallet.Coins`, dailyAmount);
        await db.set(`${interaction.user.id}_General.DailyYami`, now);

        const dailyEmbed = new Discord.EmbedBuilder()
            .setColor("Green")
            .setTitle("💸 Daily coletado!")
            .setDescription(
                `Você recebeu **${formatNumber(dailyAmount)}** coins e já está rendendo na sua conta! 🏦`
            )

        await interaction.reply({ embeds: [dailyEmbed] });

        if (premiumReward > 0) {
            await db.add(`${interaction.user.id}_Wallet.YamiCoins`, premiumReward);

            const treasureEmbed = new Discord.EmbedBuilder()
                .setColor("Gold")
                .setTitle("🏴‍☠️ TESOURO ENCONTRADO!")
                .setDescription(
                    `Você achou o **tesouro escondido** e encontrou **${premiumReward} YamiCoin${premiumReward > 1 ? "s" : ""}** 💎\n\nParabéns, a sorte te escolheu!`
                )

            await interaction.followUp({
                embeds: [treasureEmbed]
            });
        }
    }
}