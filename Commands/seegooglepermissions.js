const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { displayPermissions } = require('../handlers/sheetinteraction');
const { NUM_TO_ROLE } = require('../const/googlepermissions');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('seepermissions')
    .setDescription('See all access to all sheets')
    .addUserOption(option =>
        option.setName('user')
        .setDescription('A single users access permissions')
        .setRequired(false)
    ),
    async execute({interaction, isMod}) {
        if(!isMod) {
            // unauthorized person calling the command
            await interaction.reply({content: 'Only moderators can call this command', ephemeral: true});
            console.log(`Bad Actor tried to create a modreport\n
                         ${interaction.user.username} | ${interaction.user.id}`);
            return;
        }
        let user_id = undefined;
        if (interaction.options.getUser('user') !== null)
            user_id = interaction.options.getUser('user').id;
        const perms = await displayPermissions();
        // reformat the perms to display nicely within discord
        if (perms === null) {
            // the call failed, or we had no data in there
            interaction.reply("Failed to retrieve data. Please try again later");
            return;
        }
        else if (perms === undefined) {
            interaction.reply("No data to display. Please add a user and try again");
            return;
        }

        embed_list = [];
        if (interaction.options.getUser('user') !== null) {
            user_id = interaction.options.getUser('user').id; 
            for (let i = 0; i < perms.length; i += 1) {
                if (`${perms[i][0]}` !== user_id)
                    continue;
                const name = interaction.guild.members.cache.find(user => user.id === `${perms[i][0]}`).user.username;
                embed = new EmbedBuilder()
                .setTitle(`${name}`)
                .addFields({name: 'Email', value: `${perms[i][1]}`}, 
                           {name: 'Role', value: `${perms[i][2]}`}, 
                           {name: `Report Sheet Access:`, value: `${NUM_TO_ROLE[perms[i][3]]}`}, 
                           {name: `Punishment Sheet Access:`, value: `${NUM_TO_ROLE[perms[i][4]]}`},
                           {name: `Punishment Google Form Access:`, value: `${NUM_TO_ROLE[perms[i][5]]}`});
                embed_list.push(embed);
            }
        }
        else {
            for (let i = 0; i < perms.length; i += 1) {
                const name = interaction.guild.members.cache.find(user => user.id === `${perms[i][0]}`).user.username;
                embed = new EmbedBuilder()
                .setTitle(`${name}`)
                .addFields({name: 'Email', value: `${perms[i][1]}`}, 
                        {name: 'Role', value: `${perms[i][2]}`}, 
                        {name: `Report Sheet Access:`, value: `${NUM_TO_ROLE[perms[i][3]]}`}, 
                        {name: `Punishment Sheet Access:`, value: `${NUM_TO_ROLE[perms[i][4]]}`},
                        {name: `Punishment Google Form Access:`, value: `${NUM_TO_ROLE[perms[i][5]]}`});
                embed_list.push(embed);
            }
        }
        interaction.reply({embeds:embed_list, components: []});
    }
}