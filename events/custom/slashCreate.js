// This event is fired when the interaction was a (slash) command

const { EmbedBuilder } = require('discord.js');
const { showPrivacyNotice, checkIfMemberInDatabase } = require('../../utils/common');

module.exports = {
  async execute(interaction) {
    const { client } = interaction;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) {
      return;
    }

    if (command.nsfw && !interaction.channel.nsfw) {
      const embed = new EmbedBuilder()
        .setTitle('B O N K')
        .setDescription('pls use that somewhere else...');
      await interaction.reply({ ephemeral: false, embeds: [embed] });
      return;
    }

    if (command.required_roles > 0) {
      // eslint-disable-next-line max-len
      if (!interaction.member.roles.cache.some((role) => command.required_roles.includes(role.id))) {
        await interaction.reply({ ephemeral: true, content: "I'm sorry, but you're not allowed to do that ;(" });
        return;
      }
    }

    if (command.needsConsent) {
      if (!await checkIfMemberInDatabase(interaction)) {
        await showPrivacyNotice(interaction);
        return;
      }
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.log(error);
    }
  },
};
