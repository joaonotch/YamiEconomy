const Discord = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Utilidades ・ apaga rs',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'quantidade',
            description: 'quantidade que deseja apgar',
            type: Discord.ApplicationCommandOptionType.Integer,
            required: true
        }
    ],

    run: async(client, interaction) => {
        const quantidade = interaction.options.getInteger('quantidade');

    try {
      await interaction.channel.bulkDelete(quantidade, true);
      await interaction.reply({ content: `Foram apagadas \`${quantidade}\` mensagens.`, ephemeral: true });

    } catch (error) {
      console.error('Erro ao apagar mensagens:', error);
      await interaction.reply({ content: 'Ocorreu um erro ao tentar apagar as mensagens. Certifique-se de que o bot tem a permissão "Gerenciar Mensagens" e que as mensagens têm menos de 14 dias de idade.', ephemeral: true });
    }
  },
}
