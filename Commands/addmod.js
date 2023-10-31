const { SlashCommandBuilder } = require('discord.js');
const { addViewer, addEditor } = require('../handlers/sheetinteraction');
const { NO_ACCESS, VIEWER, SUGGESTER, EDITOR } = require('../const/googlepermissions');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('addmod')
    .setDescription('Add a new mod to the team, and give them access to the google sheet')
    .addStringOption(option =>
        option.setName('modrole')
        .setDescription('Select if they are going to be an Archivist or Keeper')
        .setRequired(true)
        .addChoices(
            {name: 'Archivist', value: 'Archivist'}, 
            {name: 'Keeper', value: 'Keeper'}
        )
    )
    .addUserOption(option =>
        option.setName('user')
        .setDescription('The user who will be added to the google sheet')
        .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('email')
        .setDescription('Email to be used to access the google sheet')
        .setRequired(true)   
    )
    // .addBooleanOption(option =>
    //     option.setName('viewer')
    //     .setDescription('This should be true if the user needs to be a viewer in the sheet, false if an editor')
    //     .setRequired(true)
    // )
    .addStringOption(option =>
        option.setName('sheet')
        .setDescription('what sheet this user is being added to')
        .addChoices(
            {name: 'Report Sheet', value: 'Report_Sheet'},
            {name: 'Punishment Sheet', value: 'Punishment_Sheet'},
            {name: 'Punishment Log Form', value: 'Punishment_Log_Form'}
        )
        .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('permission')
        .setDescription('The permissions given to this user')
        .addChoices({name: 'No Access', value: NO_ACCESS},
                    {name: 'Viewer', value: VIEWER},
                    {name: 'Suggester', value: SUGGESTER},
                    {name: 'Editor', value: EDITOR}        
        )
        .setRequired(true)
    ),
    async execute({interaction, isMod}) {
        // we are going to first confirm they have the role, and if not we can either give it to them, or we can deny the request outright
        // I will implement the latter for the time being, but this should be subject to change
        // nevermind the latter is literally not possible without passing too many important variables through to various commands

        if(!isMod) {
            // unauthorized person calling the command
            await interaction.reply({content: 'Only moderators can call this command', ephemeral: true});
            console.log(`Bad Actor tried to create a modreport\n
                         ${interaction.user.username} | ${interaction.user.id}`);
            return;
        }
        const user_id = interaction.options.getUser('user').id;
        const email_address = interaction.options.getString('email');
        const role = interaction.options.getString('modrole');
        const sheet = interaction.options.getString('sheet');
        const permission = interaction.options.getInteger('permission');

        try {
            await addEditor(user_id, email_address, role, sheet, permission);
            await interaction.reply({content:`${email_address} added!`, ephemeral: true});
        }
        catch(err) {
            console.error(err);
            return;
        }
    }
}