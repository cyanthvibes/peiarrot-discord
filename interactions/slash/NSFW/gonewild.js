const { get } = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  nsfw: true,
  data: new SlashCommandBuilder()
    .setName('gonewild')
    .setDescription('Shows a picture from r/gonewild'),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      get('https://nekobot.xyz/api/image?type=gonewild').then(async (result) => {
        const embed = new EmbedBuilder()
          .setImage(result.data.message)
          .setTitle('r/gonewild');
        await interaction.editReply({ embeds: [embed], ephemeral: false });
      });
    } catch (error) {
      console.log(error);
    }
  },
};
