module.exports = {

  async execute(interaction) {
    const { client } = interaction;
    if (!interaction.isContextMenuCommand()) {
      return;
    }

    if (interaction.isMessageContextMenuCommand()) {
      const command = client.contextCommands.get(`message/${interaction.commandName}`);

      await command.execute(interaction);
    }

    if (interaction.isUserContextMenuCommand()) {
      const command = client.contextCommands.get(`member/${interaction.commandName}`);
      await command.execute(interaction);
    }
  },
};





