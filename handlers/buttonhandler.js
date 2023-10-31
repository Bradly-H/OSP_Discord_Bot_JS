const { ActionRowBuilder, 
    ButtonBuilder, ButtonStyle,
    Client, Collection, 
    EmbedBuilder, Events, 
    Partials } = require('discord.js');
const axios = require('axios');
const env = require('dotenv');
env.config();
const {getSheetValue} = require('./sheetinteraction.js');
const { BOT_DESCRIPTION_HELP_EMBED, PREV_PAGE_HELP_BUTTON, MOD_SAFE_HELP_EMBED, NEXT_PAGE_HELP_BUTTON } = require('../const/helppages.js');
module.exports = {
    async ButtonInteraction(interaction) {
        if (interaction.customId === 'report_seen' && interaction.message.author.id === process.env.CLIENT_ID) {
            // clicked a button with the report seen id that was sent by my bot
            // this means I need to edit the original ephemeral message
            const m = interaction.message;
            const embed = m.embeds[0];
            m.edit({embeds:[embed], components:[]});
            const token = await getSheetValue(interaction.message.id);
            // through metadata in the sheet I can rewrite this function so it first checks how old the token is, and if it is more than 15 minutes
            // old then we can skip the axios call, for now it is being handled by the try-catch
            try {
                axios.post(`https://discord.com/api/v10/webhooks/${process.env.CLIENT_ID}/${token}`, 
                {content: 'A mod has seen this report', ephemeral: true, flags:64});
                interaction.deferUpdate();
            }
            catch (error) {
                console.error(error);
                interaction.reply('unable to inform user that report is handled');
            }
        }
        if (interaction.customId === 'deliberate') {
            // This is the button associated with the /modreport command, and needs to edit the original embed sent with this button to now 
            // add the person who clicked to the button to the list of deliberating mods
            interaction.deferUpdate();
            const m = interaction.message;
            const embed = m.embeds[0];
            const buttons = m.components[0];
            let new_embed = new EmbedBuilder()
                .setFooter(embed.footer);
            for (let i = 0; i < embed.fields.length; i += 1) {
                if (i != 5) {
                    new_embed.addFields({name: `${embed.fields[i].name}`, value: `${embed.fields[i].value}`});
                }
                else {
                    new_embed.addFields({name: `${embed.fields[5].name}`, value: `${embed.fields[5].value}\n${interaction.user.tag}`});
                }
            }
            m.edit({embeds:[new_embed], components:[buttons]});
        }
        if (interaction.customId === 'description_bot') {
            // edit the message to show the description of the bot.
            interaction.deferUpdate();
            const m = interaction.message;
            m.edit({embeds: [BOT_DESCRIPTION_HELP_EMBED], components: [PREV_PAGE_HELP_BUTTON]});
        }
        if (interaction.customId === 'description_commands') {
            // edit the message to show the description of the commands
            // button only appears on bot description page, and bot description page can only be found by mods
            // this can then be mod safe
            interaction.deferUpdate();
            const m = interaction.message;
            m.edit({embeds: [MOD_SAFE_HELP_EMBED], components: [NEXT_PAGE_HELP_BUTTON]});
        }
    }
}