const Discord = require('discord.js');
const { formatNumber } = require('../../Eventos/Client/format');
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
            new Discord.StringSelectMenuBuilder()
                .setCustomId('select_banks_opt')
                .setPlaceholder('Clique aqui para abrir o menu')
                .addOptions([
                    {
                        label: 'Atualizar dados bancários',
                        value: 'updatebank',
                        description: 'Atualize o sistema do banco.',
                        emoji: '🟣'
                    },
                    {
                        label: 'Conversão de Moedas',
                        value: 'coinsconvert',
                        description: 'Converta suas moedas para outros tipos de moedas',
                        emoji: '🔁'
                    }
                ])
        )

        interaction.reply({ embeds: [EmbedPay], components: [menu] })




        // Captura interação do dropdown
        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: Discord.ComponentType.StringSelect, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId !== 'select_banks_opt') return;

            const choice = i.values[0];

            if (choice === 'coinsconvert') {

                const EmbedConvert = new Discord.EmbedBuilder()
                    .setTitle("**YAMI BANK | SUA CONTA DIGITAL 🏦**")
                    .setDescription(`Você está no menu de conversões, veja a tabela abaixo para informações:\n\n> Converta __5000__ coins em __1__ YamiCoin.\n> Converta __1__ Yamicoin em __5000__ coins.\n\nAbaixo, abra o menu para selecionar a opção desejada.`)

                // Cria botão de confirmar conversão
                const buttonRow = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('back_to_bank')
                        .setLabel('Voltar para o Banco 💠')
                        .setStyle(Discord.ButtonStyle.Primary),

                    new Discord.ButtonBuilder()
                        .setCustomId('coinstoyami_btn')
                        .setLabel('Coins para YamiCoins 🔁')
                        .setStyle(Discord.ButtonStyle.Success),

                    new Discord.ButtonBuilder()
                        .setCustomId('yamitocoins_btn')
                        .setLabel('YamiCoins para Coins 🔁')
                        .setStyle(Discord.ButtonStyle.Success),
                );

                await i.update({
                    components: [buttonRow],
                    embeds: [EmbedConvert]
                });
            } else if (choice === 'updatebank') {
                const getCoins = await db.get(`${interaction.user.id}_Wallet.Coins`) || '0';
                const getYamiCoins = await db.get(`${interaction.user.id}_Wallet.YamiCoins`) || '0';

                const EmbedPay = new Discord.EmbedBuilder()
                    .setTitle("**YAMI BANK | SUA CONTA DIGITAL 🏦**")
                    .setDescription(`Olá! Bem vindo(a) ao Yami Bank, seu banco confiável que guarda seu dinheiro com segurança! Aqui está um resumo geral da sua conta:\n\n💰 | Coins: **${getCoins}**\n🌸 | YamiCoins: **${getYamiCoins}**`)

                const menu = new Discord.ActionRowBuilder().addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('select_banks_opt')
                        .setPlaceholder('Clique aqui para abrir o menu')
                        .addOptions([
                            {
                                label: 'Atualizar dados bancários',
                                value: 'updatebank',
                                description: 'Atualize o sistema do banco.',
                                emoji: '🟣'
                            },
                            {
                                label: 'Conversão de Moedas',
                                value: 'coinsconvert',
                                description: 'Converta suas moedas para outros tipos de moedas',
                                emoji: '🔁'
                            }
                        ])
                )

                interaction.editReply({ embeds: [EmbedPay], components: [menu] })
            }
        });

        // Captura clique do botão
        const buttonCollector = interaction.channel.createMessageComponentCollector({ filter, componentType: Discord.ComponentType.Button, time: 60000 });

        buttonCollector.on('collect', async btn => {
            if (btn.customId === 'back_to_bank') {

                const getCoins = await db.get(`${interaction.user.id}_Wallet.Coins`) || '0';
                const getYamiCoins = await db.get(`${interaction.user.id}_Wallet.YamiCoins`) || '0';

                const EmbedPay = new Discord.EmbedBuilder()
                    .setTitle("**YAMI BANK | SUA CONTA DIGITAL 🏦**")
                    .setDescription(`Olá! Bem vindo(a) ao Yami Bank, seu banco confiável que guarda seu dinheiro com segurança! Aqui está um resumo geral da sua conta:\n\n💰 | Coins: **${getCoins}**\n🌸 | YamiCoins: **${getYamiCoins}**`)

                const menu = new Discord.ActionRowBuilder().addComponents(
                    new Discord.StringSelectMenuBuilder()
                        .setCustomId('select_banks_opt')
                        .setPlaceholder('Clique aqui para abrir o menu')
                        .addOptions([
                            {
                                label: 'Atualizar dados bancários',
                                value: 'updatebank',
                                description: 'Atualize o sistema do banco.',
                                emoji: '🟣'
                            },
                            {
                                label: 'Conversão de Moedas',
                                value: 'coinsconvert',
                                description: 'Converta suas moedas para outros tipos de moedas',
                                emoji: '🔁'
                            }
                        ])
                )

                await interaction.editReply({ embeds: [EmbedPay], components: [menu] })
            } else if (btn.customId === 'coinstoyami_btn') {
                const getCoins = await db.get(`${interaction.user.id}_Wallet.Coins`);
                const getYamiCoins = await db.get(`${interaction.user.id}_Wallet.YamiCoins`);

                const EmbedConverter = new Discord.EmbedBuilder()
                .setTitle("**YAMI BANK | SUA CONTA DIGITAL 🏦**")
                .setDescription(`Você está na área de conversões de moedas! Utilize o menu abaixo para selecionar a quantidade de moedas que deseja converter.`)

                await interaction.editReply({
                    embeds: [EmbedConverter]
                })
            }
        });

    }
}