// This is the main file of the bot
require('dotenv').config();

const fs = require('fs');
const {
  Routes, REST, Client, Collection, GatewayIntentBits, Partials,
} = require('discord.js');
const { sequelize } = require('./database/sequelize');

const client = new Client({
  // Intents we need
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.selectCommands = new Collection();
client.contextCommands = new Collection();
client.buttonCommands = new Collection();
client.modalCommands = new Collection();
client.cooldowns = new Collection();
client.autocompleteInteractions = new Collection();
client.triggers = new Collection();
client.config = require('./config');

// eslint-disable-next-line import/extensions
client.sequelize = require('./database/sequelize.js');

sequelize.sync({ alter: true });

// Loading events for our bot
const eventFolders = fs.readdirSync('./events');

eventFolders.forEach((folder) => {
  const files = fs
    .readdirSync(`./events/${folder}`)
    .filter((file) => file.endsWith('.js'));
  files.forEach((file) => {
    const event = require(`./events/${folder}/${file}`);
    client.on(
      file.replace(/\.[^/.]+$/, ''),
      async (...args) => event.execute(...args, client),
    );
  });
});

// Registration of message-based commands
// These are only used for owner-only commands
const commandFolders = fs.readdirSync('./commands');

commandFolders.forEach((folder) => {
  const files = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith('.js'));
  files.forEach((file) => {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  });
});

// Registration of commands
const slashCommandsFolders = fs.readdirSync('./interactions/slash');

slashCommandsFolders.forEach((folder) => {
  const files = fs
    .readdirSync(`./interactions/slash/${folder}`)
    .filter((file) => file.endsWith('.js'));
  files.forEach((file) => {
    const command = require(`./interactions/slash/${folder}/${file}`);
    client.slashCommands.set(command.data.name, command);
  });
});

// Registration of autocomplete interactions
const autocompleteInteractionsFolders = fs.readdirSync('./interactions/autocomplete');

autocompleteInteractionsFolders.forEach((folder) => {
  const files = fs
    .readdirSync(`./interactions/autocomplete/${folder}`)
    .filter((file) => file.endsWith('.js'));
  files.forEach((file) => {
    const interaction = require(`./interactions/autocomplete/${folder}/${file}`);
    client.autocompleteInteractions.set(interaction.name, interaction);
  });
});

// Registration of context-menu interactions
const contextMenusFolders = fs.readdirSync('./interactions/context-menus');

contextMenusFolders.forEach((folder) => {
  const files = fs
    .readdirSync(`./interactions/context-menus/${folder}`)
    .filter((file) => file.endsWith('.js'));
  files.forEach((file) => {
    const menu = require(`./interactions/context-menus/${folder}/${file}`);
    const keyName = `${folder}/${menu.data.name}`;
    client.contextCommands.set(keyName, menu);
  });
});

// Registration of button interactions
const buttonFiles = fs.readdirSync('./interactions/buttons/');

buttonFiles.forEach((file) => {
  const button = require(`./interactions/buttons/${file}`);
  client.buttonCommands.set(button.id, button);
});

// Registration of modal interactions
const modalCommandsFolders = fs.readdirSync('./interactions/modals');

modalCommandsFolders.forEach((folder) => {
  const files = fs
    .readdirSync(`./interactions/modals/${folder}`)
    .filter((file) => file.endsWith('.js'));
  files.forEach((file) => {
    const modal = require(`./interactions/modals/${folder}/${file}`);
    client.modalCommands.set(modal.id, modal);
  });
});

// Registration of select-menu interactions
const selectMenusFolders = fs.readdirSync('./interactions/select-menus');

selectMenusFolders.forEach((folder) => {
  const files = fs
    .readdirSync(`./interactions/select-menus/${folder}`)
    .filter((file) => file.endsWith('.js'));
  files.forEach((file) => {
    const command = require(`./interactions/select-menus/${folder}/${file}`);
    client.selectCommands.set(command.id, command);
  });
});

const rest = new REST({ version: '10' }).setToken(client.config.TOKEN);

const commandJsonData = [
  ...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
  ...Array.from(client.contextCommands.values()).map((c) => c.data),
];

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(client.config.CLIENT_ID, client.config.GUILD_ID),

      { body: commandJsonData },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.log(error);
  }
})();

// Login into our client application
client.login(client.config.TOKEN).catch((error) => console.log(error.message));

process.on('unhandledRejection', (error) => {
  console.log('Unhandled promise rejection:', error);
});

module.exports = client.slashCommands;
module.exports = client.config;
