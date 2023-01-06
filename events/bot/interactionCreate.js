// This event is fired on every interaction the bot receives

module.exports = {
  // eslint-disable-next-line consistent-return
  async execute(interaction) {
    const { client } = interaction;

    if (interaction.isChatInputCommand()) {
      return client.emit('slashCreate', interaction);
    }

    if (interaction.isButton()) {
      return client.emit('buttonInteraction', interaction);
    }

    if (interaction.isAutocomplete()) {
      return client.emit('autocompleteInteraction', interaction);
    }

    if (interaction.isModalSubmit()) {
      return client.emit('modalInteraction', interaction);
    }

    if (interaction.isContextMenuCommand()) {
      return client.emit('contextInteraction', interaction);
    }
  },
};
