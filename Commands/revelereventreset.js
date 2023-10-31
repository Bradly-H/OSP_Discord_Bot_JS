const { SlashCommandBuilder, TextChannel } = require('discord.js');
const { EVENT_TEXT_CHANNEL_ID, EVENT_VOICE_CHANNEL_ID } = require('../const/channelid');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resetevent')
		.setDescription('Resets Event Hall channel permissions to the locked state'),
	async execute({interaction, isMod}) {
        // if (interaction.user.roles.cache.some(role => role.name === ''))
        const roles = interaction.user.roles.cache;
        if (!isMod) {
            // unauthorized person calling the command
            await interaction.reply({content: 'Only moderators can call this command', ephemeral: true});
            console.log(`Bad Actor tried to unlock reveler channels\n
                         ${interaction.user.username} | ${interaction.user.id}`);
            return;
        }
        
        if (interaction.guild.id === process.env.OSP_GUILD_ID || interaction.guild.id === process.env.OSP_TEST_GUILD_ID) {
            const voice_channel = interaction.guild.channels.cache.find(ch => ch.id === EVENT_VOICE_CHANNEL_ID);
            voice_channel.permissionsOverwrites.edit(interaction.guild.id, { Connect: false });


            const text_channel = interaction.guild.channels.cache.find(ch => ch.id === EVENT_TEXT_CHANNEL_ID);
            text_channel.permissionsOverwrites.edit(interaction.guild.id, { SendMessages: false });

            voice_channel.setName('The Event Hall');
        }

	},
};