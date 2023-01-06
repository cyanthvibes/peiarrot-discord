const rolePickerRoles = require('../../data/selfRoles');

module.exports = {

  async execute(interaction) {
    const { customId } = interaction;
    const { member } = interaction;
    const roleId = rolePickerRoles[customId].ROLE_ID;

    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId);
      interaction.reply({ ephemeral: true, content: `\`I have removed the role ${rolePickerRoles[customId].LABEL}\`` });
    } else {
      await member.roles.add(roleId);
      interaction.reply({ ephemeral: true, content: `\`I have added the role ${rolePickerRoles[customId].LABEL}\`` });
    }
  },
};
