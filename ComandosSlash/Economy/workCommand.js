const Discord = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    name: 'work',
    description: 'Economy ・ Get a random job and earn money!',
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        const cooldown = 3 * 60 * 60 * 1000; // 3 horas em ms
        const lastWork = await db.get(`${interaction.user.id}_General.WorkCooldown`);
        const now = Date.now();

        if (lastWork && (now - lastWork) < cooldown) {
            const timeLeft = cooldown - (now - lastWork);

            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            return interaction.reply({
                content: `⏳ Calma aí!\nVocê precisa esperar **${hours}h ${minutes}m ${seconds}s** pra trabalhar de novo.`,
                ephemeral: true
            });
        }

        const jobs = [
            { nome: "Desenvolvedor Back-end Júnior", valor: 3500 },
            { nome: "Suporte Técnico em TI", valor: 2200 },
            { nome: "Designer Gráfico", valor: 2800 },
            { nome: "Analista de Sistemas", valor: 4500 },
            { nome: "Programador Full Stack Pleno", valor: 6500 }
        ];

        const job = jobs[Math.floor(Math.random() * jobs.length)];

        await db.set(`${interaction.user.id}_General.WorkCooldown`, now);

        interaction.reply(`## 🛠️ TRABALHO INICIADO
Você está trabalhando como \`${job.nome}\`. Seu salário cairá jaja!`);

        setTimeout(async () => {
            await db.add(`${interaction.user.id}_Wallet.Coins`, job.valor);
            interaction.editReply(`## 🏢 EXPEDIENTE FINALIZADO
Você trabalhou como \`${job.nome}\` e ganhou **${job.valor} coins**! Seu salário já está rendendo.`);
        }, 5000);
    }
};
