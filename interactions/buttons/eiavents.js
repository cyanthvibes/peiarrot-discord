const { EventAttendance } = require('../../database/sequelize');
const { loadAttendanceFromDB, generateEIAventEmbed } = require('../../utils/common');

module.exports = {

  async execute(interaction) {
    const embed = interaction.message.embeds[0];
    const { customId } = interaction;
    const memberId = interaction.member.id;

    const eiaventId = embed.data.footer.text;

    const {
      going, notGoing, maybe, lft, selling,
    } = await loadAttendanceFromDB(eiaventId);

    if (customId === 'GOING') {
      if (going.includes(memberId)) {
        going.splice(going.indexOf(memberId), 1);
        await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'going' } });
      } else {
        going.push(memberId);
        await EventAttendance.create({ member_id: memberId, event_id: eiaventId, response: 'going' });

        try {
          notGoing.splice(notGoing.indexOf(memberId), 1);
          await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'not-going' } });
        } catch (e) { /* empty */ }

        try {
          maybe.splice(maybe.indexOf(memberId), 1);
          await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'maybe' } });
        } catch (e) { /* empty */ }
      }
    }

    if (customId === 'NOT_GOING') {
      if (notGoing.includes(memberId)) {
        notGoing.splice(notGoing.indexOf(memberId), 1);
        await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'not-going' } });
      } else {
        notGoing.push(memberId);
        await EventAttendance.create({ member_id: memberId, event_id: eiaventId, response: 'not-going' });

        if (going.includes(memberId)) {
          going.splice(going.indexOf(memberId), 1);
          await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'going' } });
        }

        if (maybe.includes(memberId)) {
          maybe.splice(maybe.indexOf(memberId), 1);
          await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'maybe' } });
        }
      }
    }

    if (customId === 'MAYBE') {
      if (maybe.includes(memberId)) {
        notGoing.splice(notGoing.indexOf(memberId), 1);
        await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'maybe' } });
      } else {
        maybe.push(memberId);
        await EventAttendance.create({ member_id: memberId, event_id: eiaventId, response: 'maybe' });

        if (going.includes(memberId)) {
          going.splice(going.indexOf(memberId), 1);
          await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'going' } });
        }

        if (notGoing.includes(memberId)) {
          notGoing.splice(notGoing.indexOf(memberId), 1);
          await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'not-going' } });
        }
      }
    }

    if (customId === 'LFT') {
      if (lft.includes(memberId)) {
        lft.splice(lft.indexOf(memberId), 1);
        await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'lft' } });
      } else {
        lft.push(memberId);
        await EventAttendance.create({ member_id: memberId, event_id: eiaventId, response: 'lft' });

        if (selling.includes(memberId)) {
          selling.splice(selling.indexOf(memberId), 1);
          await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'selling' } });
        }
      }
    }

    if (customId === 'SELLING') {
      if (selling.includes(memberId)) {
        selling.splice(selling.indexOf(memberId), 1);
        await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'selling' } });
      } else {
        selling.push(memberId);
        await EventAttendance.create({ member_id: memberId, event_id: eiaventId, response: 'selling' });

        if (lft.includes(memberId)) {
          lft.splice(lft.indexOf(memberId), 1);
          await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'lft' } });
        }
      }
    }

    const newEmbed = await generateEIAventEmbed(eiaventId);
    await interaction.update({ embeds: [newEmbed] });
  },
};
