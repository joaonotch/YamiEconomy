const Discord = require('discord.js');
const { formatNumber } = require('../../Events/Client/formatEvent');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: 'bank',
    description: 'Economy ・ Digital access to your YamiBank account.',
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        const getCoins = await db.get(`${interaction.user.id}_Wallet.Coins`) || '0';
        const getYamiCoins = await db.get(`${interaction.user.id}_Wallet.YamiCoins`) || '0';

        const EmbedPay = new Discord.EmbedBuilder()
            .setTitle("**YAMI BANK | SUA CONTA DIGITAL 🏦**")
            .setDescription(`Olá! Bem vindo(a) ao Yami Bank, seu banco confiável que guarda seu dinheiro com segurança! Aqui está um resumo geral da sua conta:\n\n💰 | Coins: **${formatNumber(getCoins)}**\n🌸 | YamiCoins: **${formatNumber(getYamiCoins)}**`)

        const menu = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('back_to_bank')
                .setLabel('Update')
                .setStyle(Discord.ApplicationCommandType.ChatInput)
                .setEmoji('🔁')
        )

        interaction.reply({ embeds: [EmbedPay], components: [menu] })


        // Captura interação do botão
        const filter = i => i.user.id === interaction.user.id;
        const buttonCollector = interaction.channel.createMessageComponentCollector({ filter, componentType: Discord.ComponentType.Button, time: 60000 });

        buttonCollector.on('collect', async btn => {
            if (btn.customId === 'back_to_bank') {

                const getCoins = await db.get(`${interaction.user.id}_Wallet.Coins`) || '0';
                const getYamiCoins = await db.get(`${interaction.user.id}_Wallet.YamiCoins`) || '0';

                const EmbedPay = new Discord.EmbedBuilder()
                    .setTitle("**YAMI BANK | SUA CONTA DIGITAL 🏦**")
                    .setDescription(`Olá! Bem vindo(a) ao Yami Bank, seu banco confiável que guarda seu dinheiro com segurança! Aqui está um resumo geral da sua conta:\n\n💰 | Coins: **${getCoins}**\n🌸 | YamiCoins: **${getYamiCoins}**`)

                const menu = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('back_to_bank')
                        .setLabel('Update')
                        .setStyle(Discord.ApplicationCommandType.ChatInput)
                        .setEmoji('🔁')
                )

                await interaction.editReply({ embeds: [EmbedPay], components: [menu] })
                interaction.followUp({ content: `> Sistema atualizado com sucesso! Novas informações atualizadas.`, ephemeral: true })
            }
        });
    }
}