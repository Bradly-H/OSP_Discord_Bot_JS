const { SlashCommandBuilder } = require('discord.js');
const { removeAccess } = require('../handlers/sheetinteraction');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('removemod')
    .setDescription('remove a mod from the team, and remove their access from all google sheet')
    .addUserOption(option =>
        option.setName('user')
        .setDescription('The user who will be removed from the google sheet')
        .setRequired(true)
    ),
    async execute({interaction, isMod}) {
        if(!isMod) {
            // unauthorized person calling the command
            await interaction.reply({content: 'Only moderators can call this command', ephemeral: true});
            console.log(`Bad Actor tried to create a modreport\n
                         ${interaction.user.username} | ${interaction.user.id}`);
            return;
        }
        const user = interaction.options.getUser('user');
        const user_id = user.id;
        const ret = await removeAccess(user_id);
        if (ret === 0) {
            interaction.reply(`${user} removed!`);
        }
        else if (ret === 1) {
            interaction.reply(`${user} not found in access sheet`);
        }
    }
}