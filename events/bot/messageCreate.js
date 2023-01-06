// This event is fired on every message the bot receives

module.exports = {
  async execute(message) {
    const {
      client, guild, channel, content, author,
    } = message;
    const prefix = client.config.PREFIX;
    const owner = client.config.OWNER_ID;
    const args = content.slice(prefix.length).trim().split(/ +/);
    const commandFromArgs = args.shift().toLowerCase();

    if (message.mentions.has(client.user)) {
      // TODO: something ;)
      console.log('mentioned');
      return;
    }

    if (!message.content.startsWith(client.config.PREFIX) || message.author.bot) {
      return;
    }

    const command = client.commands.get(commandFromArgs) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandFromArgs));

    if (!command) {
      return;
    }

    if (command.ownerOnly && message.author.id !== owner) {
      console.log('owner only!');
      return;
    }

    // TODO: more checks?

    try {
      command.execute(message, args);
    } catch (error) {
      console.log(error);
    }
  },
};
