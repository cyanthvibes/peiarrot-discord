const { Member } = require('../../database/sequelize');
const {
  showPrivacyNotice, refreshAllEIAventEmbeds,
} = require('../../utils/common');

module.exports = {

  async execute(interaction) {
    const { customId } = interaction;
    const memberId = interaction.member.id;

    if (customId === 'yes-privacy-notice') {
      await interaction.deferReply({ ephemeral: true });
      try {
        await Member.create({ member_id: memberId });
      } catch (err) { /* empty */ }
      await showPrivacyNotice(interaction);
    }

    if (customId === 'no-privacy-notice') {
      await interaction.update({
        ephemeral: true, content: 'Alrighty, I won\'t collect any of your data', embeds: [], components: [],
      });
    }

    if (customId === 'delete-privacy-notice') {
      await interaction.deferReply({ ephemeral: true });
      try {
        await Member.destroy({
          where: {
            member_id: memberId,
          },
        });
      } catch (err) { /* empty */ }

      await refreshAllEIAventEmbeds(interaction);

      await showPrivacyNotice(interaction);
    }
  },
};
