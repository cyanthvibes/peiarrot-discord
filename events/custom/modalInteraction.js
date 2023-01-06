// This event is fired when the interaction was a modal

const eiavents = require('../../interactions/modals/EIAvents/eiavent');

module.exports = {

  async execute(interaction) {
    const { client } = interaction;

    if (!interaction.isModalSubmit()) {
      return;
    }

    const command = client.modalCommands.get(interaction.customId);

    if (!command) {
      return;
    }

    if (interaction.customId === 'eiaventModal') {
      await eiavents.execute(interaction);
    }
  },
};
