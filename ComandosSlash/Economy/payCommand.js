const Discord = require('discord.js');
const client = require('../../index')
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: 'pay',
    description: 'Economy ・ Transfer coins to other players.',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'Which user wants to receive the money?',
            type: Discord.ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'coin',
            description: 'What type of currency would you like to send?',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Coins 💰',
                    value: 'Coins'
                },
                {
                    name: 'YamiCoins 🌸',
                    value: 'YamiCoins'
                }
            ]
        },
        {
            name: 'amount',
            description: 'Amount to send',
            type: Discord.ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    run: async (client, interaction) => {

        const targetUser = interaction.options.getUser('user');
        const coinType = interaction.options.getString('coin');
        const amount = interaction.options.getInteger('amount');

        const getWalletUser = await db.get(`${interaction.user.id}_Wallet.${coinType}`) || '0';

        if (getWalletUser < amount) {
            interaction.reply({
                content: `## YAMI BANK | SEU BANCO DIGITAL 🏦\nSaldo insuficiente para criar a transação desejada. Você apenas tem \`${getWalletUser}\` ${coinType}!`,
                ephemeral: true
            })
        } else {

        interaction.reply({
            content: `## TRANSFERÊNCIA VIA BANCO DIGITAL 🏦\nVocê está transferindo \`${amount}\` ${coinType} para o usuário \`${targetUser.username}\`. Deseja realmente completar esta transação?`,
            components: [
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('concluirpay')
                        .setLabel('Concluir Transação')
                        .setStyle(Discord.ButtonStyle.Primary),

                    new Discord.ButtonBuilder()
                        .setCustomId('recusarpay')
                        .setLabel('Recusar Transação')
                        .setStyle(Discord.ButtonStyle.Secondary)
                )
            ]
        });

        client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;

            if (interaction.customId === 'concluirpay') {
                await db.add(`${targetUser.id}_Wallet.${coinType}`, amount);
                await db.sub(`${interaction.user.id}_Wallet.${coinType}`, amount);

                await interaction.reply({ content: `## YAMI BANK | SUA CONTA DIGITAL 🏦\nVocê confirmou o pagamento e foi transferido \`${amount}\` ${coinType} para o usuário \`${targetUser.username}\`` });
            }

            if (interaction.customId === 'recusarpay') {
                await interaction.reply({ content: `## YAMI BANK | SUA CONTA DIGITAL 🏦\nVocê recusou o pagamento e todo o valor foram reembolsados para sua conta!` });
            }
        });
    }
}

};