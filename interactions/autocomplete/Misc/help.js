module.exports = {
  name: 'help',

  async execute(interaction) {
    const focusedValue = interaction.options.getFocused();

    const choices = Array.from(interaction.client.slashCommands.keys());

    const filtered = choices.filter((choice) => choice.startsWith(focusedValue));

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice })),
    );
  },
};
