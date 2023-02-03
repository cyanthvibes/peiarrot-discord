const { Op } = require('sequelize');
const { EmbedBuilder } = require('discord.js');
const { Event, EventAttendance } = require('../../../database/sequelize');

module.exports = {
  data: {
    name: 'Show Events',
    type: 2, // 2 is for user context menus
  },

  async execute(interaction) {
    const embed = new EmbedBuilder();

    const allEvents = await EventAttendance.findAll({
      where: { member_id: interaction.targetUser.id },
    });

    const archivedEvents = await Event.findAll({
      where: { archived: true },
    });

    const activeEvents = allEvents.filter((el) => !archivedEvents.find((f) => f.dataValues.event_id === el.dataValues.event_id));

    const arr = [
      ['Going to:', 'going'],
      ['Maybe going to:', 'maybe'],
      ['Looking for tickets for: ', 'lft'],
      ['Selling tickets for:', 'selling'],
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of arr) {
      const eventIds = activeEvents
        .filter((event) => event.dataValues.response === item[1])
        .map((event) => event.dataValues.event_id);
      if (eventIds.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        const events = (await Event
          .findAll({ where: { event_id: { [Op.in]: eventIds } } }))
          .map((event) => ({
            eventName: event.dataValues.event_name,
            channelId: event.dataValues.guild_channel_id,
            messageId: event.dataValues.message_id,
          }));
        if (events) {
          embed.addFields({
            name: item[0],
            value: events
              .map(({ eventName, channelId, messageId }) => `[${eventName}](https://discord.com/channels/${interaction.guildId}/${channelId}/${messageId})`)
              .join('\r\n'),
          });
        }
      }
    }

    embed.setDescription(`Events for <@!${interaction.targetUser.id}>:`);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
