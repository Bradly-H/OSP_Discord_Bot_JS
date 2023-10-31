const { ActionRowBuilder, 
    ButtonBuilder, ButtonStyle,
    Client, Collection, 
    EmbedBuilder, Events, 
    Partials } = require('discord.js');
var moment = require('moment');
moment().format();
const env = require('dotenv');
env.config();


module.exports = {
    async MessageDeleted(message) {
        const channel = await interaction.guild.channels.cache.find(ch => ch.id === process.env.OSP_TEST_REPORT_CHANNEL_ID);
        
        const embed = new EmbedBuilder()
        .setAuthor({name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}`})
        .setDescription(`**Message sent by <@${message.author.id}> Deleted in ${message.channel}**`)
        .addFields({name: '**Content Deleted: **', value: message.content}, // This could break if it is a massive message that was deleted, could be too much text for the embed
                   {name: 'Time: ', value: `<t:${moment().unix()}:f>`}) 
        .setFooter({text: `Author ID: ${message.author.id} | Message ID: ${message.id}`});
        channel.send({embeds: [embed]});
    },
    async MessageEdited(message) {
        const channel = await interaction.guild.channels.cache.find(ch => ch.id === process.env.OSP_TEST_REPORT_CHANNEL_ID);
        
        // link to message: https://discord.com/channels/guildId/channelId/messageId 
        // link should be `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
        const embed = new EmbedBuilder()
        .setAuthor({name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}`})
        .setDescription(`**Message sent by <@${message.author.id}> Edited in ${message.channel}**`)
        .addFields({name: '**Before: **', value: message.content}, // This could break if it is a massive message that was deleted, could be too much text for the embed
                   {name: '**After: **', value: message.content}, // This could break if it is a massive message that was deleted, could be too much text for the embed
                   {name: 'Time: ', value: `<t:${moment().unix()}:f>`}) 
        .setFooter({text: `Author ID: ${message.author.id} | Message ID: ${message.id}`});
        channel.send({embeds: [embed]});
    }
}