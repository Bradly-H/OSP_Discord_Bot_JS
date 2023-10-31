const { SlashCommandBuilder } = require('discord.js');


// theoretically this could be accomplished by accessing the google sheet, this command would instead take
// the discord ID of the user, and then ping the main google sheet of punishments and grab their data, though
// I think it may be better to deprecate this command and leave it to Dynobot
module.exports = {
	data: new SlashCommandBuilder()
		.setName('getlog')
		.setDescription('retrieves mod logs')
        .addStringOption(option => 
            option.setName('link')
                .setDescription('Link to the post being reported')
                .setRequired(true)  
        ),
	async execute({interaction, isMod}) {
        const link = interaction.options.getString('link');
        console.log(link);

	},
};