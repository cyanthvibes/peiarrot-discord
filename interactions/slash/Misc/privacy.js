const { SlashCommandBuilder } = require('discord.js');
const { showPrivacyNotice } = require('../../../utils/common');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('privacy')
    .setDescription('All the info about my data collection and your privacy.'),

  async execute(interaction) {
    await showPrivacyNotice(interaction);
  },
};
