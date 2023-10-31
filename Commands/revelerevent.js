const { SlashCommandBuilder, TextChannel } = require('discord.js');
const { EVENT_VOICE_CHANNEL_ID, EVENT_TEXT_CHANNEL_ID } = require('../const/channelid');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('revelerevent')
		.setDescription('changes Event Hall channel permissions for any reveler events')
        .addStringOption(option => 
            option.setName('event')
                .setDescription('What is the event being hosted')
                .setRequired(true)
                .addChoices(
                    {name: 'Opera', value: 'Night at the Opera'},
                    {name: 'Movie', value: 'Movie Night'},
                    {name: 'Lecture', value: 'Lecture'},
                    {name: 'Quiz', value: 'Quiz Night'},
                    {name: 'DnD Time Heist', value: 'Time Heist'},
                )  
        ),
	async execute({interaction, isMod}) {
        if (!isMod) {
            // unauthorized person calling the command
            await interaction.reply({content: 'Only moderators can call this command', ephemeral: true});
            console.log(`Bad Actor tried to unlock reveler channels\n
                         ${interaction.user.username} | ${interaction.user.id}`);
            return;
        }
        
        if (interaction.guild.id === process.env.OSP_GUILD_ID || interaction.guild.id === process.env.OSP_TEST_GUILD_ID) {
            const voice_channel = interaction.guild.channels.cache.find(ch => ch.id === EVENT_VOICE_CHANNEL_ID);
            voice_channel.permissionsOverwrites.edit(interaction.guild.id, { Connect: null });

            const text_channel = interaction.guild.channels.cache.find(ch => ch.id === EVENT_TEXT_CHANNEL_ID);
            text_channel.permissionsOverwrites.edit(interaction.guild.id, {SendMessages: null});

            const name = interaction.options.getString('event');
            voice_channel.setName(name);
        }
        

	},
};