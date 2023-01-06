const { get } = require('axios');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  nsfw: true,
  data: new SlashCommandBuilder()
    .setName('boobs')
    .setDescription('Shows boobs'),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      get('https://nekobot.xyz/api/image?type=boobs').then(async (result) => {
        const embed = new EmbedBuilder()
          .setImage(result.data.message)
          .setTitle('Boobs!');
        await interaction.editReply({ embeds: [embed], ephemeral: false });
      });
    } catch (error) {
      console.log(error);
    }
  },
};
