const { ActionRowBuilder, 
    ButtonBuilder, ButtonStyle,
    EmbedBuilder, 
    SlashCommandBuilder } 
    = require('discord.js');
const env = require('dotenv');
const { MOD_BOT_CHANNEL_ID } = require('../const/channelid');
const { MOD_SAFE_HELP_EMBED, NEXT_PAGE_HELP_BUTTON, CITIZEN_SAFE_HELP_EMBED } = require('../const/helppages');
env.config();


const prev = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('commands')
            .setLabel('Previous Page')
            .setStyle(ButtonStyle.Primary)
    );
    // need to export prev somehow
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('displays information regarding commands'),
    async execute({interaction, isMod}) {
        if (isMod){
            interaction.reply({embeds: [MOD_SAFE_HELP_EMBED], components: [NEXT_PAGE_HELP_BUTTON]});
        } 
        else {
            interaction.reply({embeds: [CITIZEN_SAFE_HELP_EMBED]});
        }
    }
}
