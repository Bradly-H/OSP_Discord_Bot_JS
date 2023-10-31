const { ActionRowBuilder,ButtonBuilder,EmbedBuilder, ButtonStyle } = require('discord.js');

const CITIZEN_SAFE_HELP_EMBED = new EmbedBuilder()
    .setTitle('Commands')
    .setAuthor({name: `OSP Discord Bot Help`, iconURL: `https://cdn.discordapp.com/avatars/${process.env.CLIENT_ID}`})
    .addFields(
        {name: `/help`, value: `Displays information regarding bot commands and data`},
        {name: `/report [user] [description]`, value: `This command allows you to report a particular user within the discord server. You will be prompted for a user, and a description of what they did wrong`});
const MOD_SAFE_HELP_EMBED = new EmbedBuilder()
    .setTitle('Commands')
    .setAuthor({name: `OSP Discord Bot Help`, iconURL: `https://cdn.discordapp.com/avatars/${process.env.CLIENT_ID}`})
    .addFields(
        {name: `/addmod [mod role] [user] [email address] [permission] [sheets]`, value: `this will give a particular email address access to specified google sheets`},
        {name: `/bulkdelete [count of messages] [channel]`, value: `This command will cause a specified number of messages in a particular channel to be deleted. The channel will either be one that is specified or where the command is called from`},
        {name: `/getlogs [id]`, value: `This command is WIP. It will display punishment information regarding a user`},
        {name: `/help`, value: `Displays information regarding bot commands and data`},
        {name: `/modreport [user] [reason]`, value: `This command allows mods within the table channels to bring up a user, why they think they should be punished, and allow other mods to display their participation in deliberation`},
        {name: `/removemod [user]`, value: `this command removes user's access from all google sheets and forms`},
        {name: `/report [user] [description]`, value: `This command allows you to report a particular user within the discord server. You will be prompted for a user, and a description of what they did wrong`},
        {name: `/revelerevent [event type]`, value: `Given the type of event that is happening, this will properly set the event channels for a given event and rename them accordingly`},
        {name: `/revelereventreset`, value: `This will reset permissions and name for the event channels`},
        {name: `/seegooglepermissions [user]`, value: `This will cause the bot to display all of the different mods, and what sheets each one has access to`});

const description1 = `This bot was built by <@357215849507061760> for the purposes of streamlining a number of processes for OSP Discord Staff.`
const description2 = `It has taken on the duties of handling keeping track of reports, helping mods deliberate on cases, streamlining archivist activities, and many other things.`
const description3 = ` The bot has provided greater integration and interaction with the punishment sheets, and a decentralized system with regards to all google documents. This bot has been built specifically for the OSP discord server, and will likely not function well outside of it.`

const BOT_DESCRIPTION_HELP_EMBED = new EmbedBuilder()
    .setTitle(`Description`)
    .setAuthor({name: `OSP Discord Bot Help`, iconURL: `https://cdn.discordapp.com/avatars/${process.env.CLIENT_ID}`})
    .setDescription(`${description1}`)
    .addFields({name: `Bot Description`,value: `${description2}${description3}`});

const PREV_PAGE_HELP_BUTTON = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('description_commands')
            .setLabel('Previous Page')
            .setStyle(ButtonStyle.Primary),
    );
const NEXT_PAGE_HELP_BUTTON = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('description_bot')
            .setLabel('Next Page')
            .setStyle(ButtonStyle.Primary)
    );

module.exports = {
    CITIZEN_SAFE_HELP_EMBED,
    MOD_SAFE_HELP_EMBED,
    PREV_PAGE_HELP_BUTTON,
    BOT_DESCRIPTION_HELP_EMBED,
    NEXT_PAGE_HELP_BUTTON

}