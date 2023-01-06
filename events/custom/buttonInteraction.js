// This event is fired when the interaction was a button

const { InteractionType, ComponentType } = require('discord.js');
const rolePickerRoles = require('../../data/selfRoles');
const eventEmojis = require('../../data/eventEmojis');
const rolePicker = require('../../interactions/buttons/rolePicker');
const eiavents = require('../../interactions/buttons/eiavents');
const privacyNotice = require('../../interactions/buttons/privacyNotice');
const { checkIfMemberInDatabase, showPrivacyNotice } = require('../../utils/common');

module.exports = {
  async execute(interaction) {
    if (interaction.type !== InteractionType.MessageComponent) {
      return;
    }

    if (interaction.componentType !== ComponentType.Button) {
      return;
    }

    const { customId } = interaction;

    if (customId in rolePickerRoles) {
      await rolePicker.execute(interaction);
    }

    if (customId in eventEmojis) {
      if (!await checkIfMemberInDatabase(interaction)) {
        await showPrivacyNotice(interaction);
        return;
      }
      await eiavents.execute(interaction);
    }

    if (customId === 'yes-privacy-notice' || customId === 'no-privacy-notice' || customId === 'delete-privacy-notice') {
      await privacyNotice.execute(interaction);
    }
  },
};
