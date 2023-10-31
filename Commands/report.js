const { ActionRowBuilder, 
        ButtonBuilder, ButtonStyle,
        EmbedBuilder, 
        SlashCommandBuilder } 
        = require('discord.js');
const { newSheetRow } = require('../handlers/sheetinteraction');
var moment = require('moment');
moment().format();
const env = require('dotenv');
env.config();

const { REPORT_CHANNEL_ID } = require('../const/channelid');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report a user')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Choose user to report')
				.setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for report')
                .setRequired(true)  
        ),
	async execute({interaction}) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const link = interaction.user.displayAvatarURL;

        await interaction.reply({content:`User reported: ${user}`, ephemeral: true});
        let mod_message = undefined;
        let channel = undefined;
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('report_seen')
                    .setLabel('Mod has seen this report')
                    .setStyle(ButtonStyle.Primary),
        );
        const embedV1 = new EmbedBuilder()
            .addFields({name: "Reported: ", value: `${user.tag}`},
                       {name: "Discord id: ", value: `${user.id}`},
                       {name: "Channel", value: `${interaction.channel}`},
                       {name: "Reason: ", value: `${reason}`},
                       {name: "Time: ", value: `<t:${moment().unix()}:f>`})

            .setFooter({text: `Sent by ${interaction.user.username} (${interaction.user.id})`});

        
        if (interaction.guild.id === process.env.OSP_GUILD_ID) {
            channel = await interaction.guild.channels.cache.find(ch => ch.id === REPORT_CHANNEL_ID);
            mod_message = await channel.send({embeds:[embedV1], components: [row]});

        }
        else if (interaction.guild.id === process.env.OSP_TEST_GUILD_ID) {
        
            channel = await interaction.guild.channels.cache.find(ch => ch.id === REPORT_CHANNEL_ID);
            await interaction.channel.send('this report has been sent in the OSP test discord and will be sent to the robot control station');
            mod_message = await channel.send({embeds:[embedV1], components: [row]});
        }
        else {
            console.log(interaction.guild.id);
            await interaction.channel.send('This report was sent outside of the OSP discords. The report message will be sent to this channel.');
            mod_message = await interaction.channel.send({embeds:[embedV1], components: [row]});
        }


        try {
            await newSheetRow(mod_message.id, interaction.token);
        }
        catch (error) {
            console.log(error);
            if (channel !== undefined){
                channel.send("failed to update google sheet, impossible to tell user that their report has been seen");
            }
            else {
                await interaction.channel.send('failed to update google sheet, impossible to tell user that their report has been seen');
            }
            await mod_message.edit({embeds: [embedV1],components: []});
        }

	},
};