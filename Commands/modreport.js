const { ActionRowBuilder, 
    ButtonBuilder, ButtonStyle,
    EmbedBuilder, 
    SlashCommandBuilder } 
    = require('discord.js');
var moment = require('moment');
const { DELIBERATION_CHANNEL_1_ID, DELIBERATION_CHANNEL_2_ID } = require('../const/channelid');
moment().format();

module.exports = {
data: new SlashCommandBuilder()
    .setName('modreport')
    .setDescription('Report a user (staff only)')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('Input User ID')
            .setRequired(true)
    )
    .addStringOption(option => 
        option.setName('reason')
            .setDescription('Input Link to message to be reported')
            .setRequired(true)  
    ),

    async execute({interaction, isMod}) {
        if (!isMod) {
            // unauthorized person calling the command
            await interaction.reply({content: 'Only moderators can call this command', ephemeral: true});
            console.log(`Bad Actor tried to create a modreport\n
                         ${interaction.user.username} | ${interaction.user.id}`);
            return;
        }
        if (interaction.channel.id !== DELIBERATION_CHANNEL_1_ID && interaction.channel.id !== DELIBERATION_CHANNEL_2_ID) {
            // not in either of the proper channels
            await interaction.reply('This command must be called in one of the table channels.');
            return;
        }
        
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');    

        await interaction.reply({content:`(${interaction.user.tag}) reported: ${user}`, ephemeral: false});
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('deliberate')
                    .setLabel('Click to deliberate')
                    .setStyle(ButtonStyle.Primary),
        );
        const embedV1 = new EmbedBuilder()
            .addFields({name: "Reported: ", value: `${user.tag}`},
                       {name: "Discord id: ", value: `${user.id}`},
                       {name: "Channel", value: `${interaction.channel}`},
                       {name: "Link: ", value: `${reason}`},
                       {name: "Time: ", value: `<t:${moment().unix()}:f>`},
                       {name: "Deliberating staff", value: `${interaction.user.tag}`})
    
            .setFooter({text: `Sent by ${interaction.user.username} (${interaction.user.id})`});
        await interaction.channel.send('For the time being this message is sent in the current channel. This will be changed as we move closer to implementing this server-wide');
        await interaction.channel.send({embeds:[embedV1], components: [row]});
        const m = interaction.editReply({content: 'Staff in deliberation: ', ephemeral: false});
    },
};