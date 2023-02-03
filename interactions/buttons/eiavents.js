const { EventAttendance } = require('../../database/sequelize');
const { loadAttendanceFromDB, generateEIAventEmbed, generateEIAventRow} = require('../../utils/common');

module.exports = {

  async execute(interaction) {
    const embed = interaction.message.embeds[0];
    const { customId } = interaction;
    const memberId = interaction.member.id;

    const eiaventId = embed.data.footer.text;

    const {
      going, maybe, lft, selling,
    } = await loadAttendanceFromDB(eiaventId);

    if (customId === 'GOING') {
      if (going.includes(memberId)) {
        going.splice(lft.indexOf(memberId), 1);
        await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'going' } });
      } else {
        going.push(memberId);
        await EventAttendance.create({ member_id: memberId, event_id: eiaventId, response: 'going' });

        if (maybe.includes(memberId)) {
          maybe.splice(selling.indexOf(memberId), 1);
          await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'maybe' } });
        }
      }
    }

    if (customId === 'MAYBE') {
      if (maybe.includes(memberId)) {
        maybe.splice(selling.indexOf(memberId), 1);
        await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'maybe' } });
      } else {
        maybe.push(memberId);
        await EventAttendance.create({ member_id: memberId, event_id: eiaventId, response: 'maybe' });

        if (going.includes(memberId)) {
          going.splice(lft.indexOf(memberId), 1);
          await EventAttendance.destroy({ where: { event_id: eiaventId, member_id: memberId, response: 'going' } });
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
    const row = await generateEIAventRow();
    await interaction.update({ embeds: [newEmbed], components: [row] });
  },
};
