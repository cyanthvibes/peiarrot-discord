const {
  SlashCommandBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder,
} = require('discord.js');
const socials = require('../../../data/socials');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('socials')
    .setDescription('Show all our socials'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setDescription('Follow International Afterparty on social media!');

    const buttons = [];

    Object.keys(socials).forEach((social) => {
      buttons.push(new ButtonBuilder()
        .setLabel(social)
        .setStyle(ButtonStyle.Link)
        .setURL(socials[social].URL)
        .setEmoji(socials[social].EMOJI_ID));
    });

    const row = new ActionRowBuilder().addComponents(buttons);

    await interaction.reply({
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });
  },
};
