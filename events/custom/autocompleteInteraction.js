// This event is fired when the interaction was an autocomplete

module.exports = {

  async execute(interaction) {
    const { client } = interaction;

    if (!interaction.isAutocomplete()) {
      return;
    }

    const request = client.autocompleteInteractions.get(
      interaction.commandName,
    );

    if (!request) {
      return;
    }

    try {
      await request.execute(interaction);
    } catch (error) {
      console.log(error);
    }
  },
};
