const { Event } = require('../../../database/sequelize');
const { generateEIAventEmbed, generateEIAventRow } = require('../../../utils/common');

module.exports = {
  id: 'eiaventModal',

  async execute(interaction) {
    await interaction.deferReply();
    const { channelId } = interaction;
    const { client } = interaction;
    const eiaventName = interaction.fields.getTextInputValue('eiaventNameInput');
    const eiaventDescriptionInput = interaction.fields.getTextInputValue('eiaventDescriptionInput');
    const eiaventImageInput = interaction.fields.getTextInputValue('eiaventImageInput');

    let eiaventId = '';

    const row = generateEIAventRow();

    try {
      eiaventId = interaction.fields.getTextInputValue('eiaventIdInput');
    } catch (e) {
      eiaventId = '';
    }

    if (eiaventId) {
      await Event.update({
        event_name: eiaventName,
        event_description: eiaventDescriptionInput,
        guild_channel_id: channelId,
        image_url: eiaventImageInput,
      }, {
        where: {
          event_id: eiaventId,
        },
      });

      const eventInDatabase = (await Event.findByPk(eiaventId));
      const targetChannelId = eventInDatabase.dataValues.guild_channel_id;
      const targetChannel = client.channels.cache.get(targetChannelId);
      const targetMessageId = eventInDatabase.dataValues.message_id;
      const targetMessage = await targetChannel.messages.fetch(targetMessageId);
      const embed = await generateEIAventEmbed(eiaventId);

      await targetMessage.edit({
        ephemeral: false, embeds: [embed], components: [row],
      });

      await interaction.deleteReply();
    } else if (!eiaventId) {
      await Event.create({
        event_name: eiaventName,
        event_description: eiaventDescriptionInput,
        guild_channel_id: channelId,
        image_url: eiaventImageInput,
      }).then((res) => {
        eiaventId = res.event_id;
      });

      const embed = await generateEIAventEmbed(eiaventId);

      await interaction.channel.send({ ephemeral: false, embeds: [embed], components: [row] })
        .then(async (message) => {
          await Event.update({ message_id: message.id }, { where: { event_id: eiaventId } });
          await message.pin();
          const targets = await interaction.channel.messages.fetch()
            .then((msgs) => msgs.filter((msg) => msg.system));
          targets.forEach((target) => target.delete());
        });

      await interaction.deleteReply();
    }
  },
};
