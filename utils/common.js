const {
  EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder,
} = require('discord.js');
const emojis = require('../data/eventEmojis');
const { EventAttendance, Event } = require('../database/sequelize');

module.exports.lowercaseAndCapitalise = (string_) => string_.toLowerCase()
  .split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

module.exports.checkIfMemberInDatabase = async (interaction) => {
  const { client } = interaction;
  const memberId = interaction.member.id;
  const result = await client.sequelize.Member.findByPk(memberId);
  return !!result;
};

module.exports.showPrivacyNotice = async (interaction) => {
  const embed = new EmbedBuilder()
    .setTitle('Hold up! Some sort of cookie-wall? What\'s this about?')
    .setColor('Random')
    .setDescription('__No worries__: by default, no user data is collected.');

  const buttons = [];

  buttons.push(
    new ButtonBuilder()
      .setLabel('Everything about data collection')
      .setStyle(ButtonStyle.Link)
      .setURL('https://github.com/cyanthvibes/peiarrot-discord/PRIVACY.md'),
  );

  if (await this.checkIfMemberInDatabase(interaction)) {
    buttons.push(
      new ButtonBuilder()
        .setLabel('Revoke & Delete')
        .setStyle(ButtonStyle.Danger)
        .setCustomId('delete-privacy-notice'),
    );
  } else {
    buttons.push(
      new ButtonBuilder()
        .setLabel('Yes.')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('yes-privacy-notice'),
    );
    buttons.push(
      new ButtonBuilder()
        .setLabel('Do not collect my data')
        .setStyle(ButtonStyle.Success)
        .setCustomId('no-privacy-notice'),
    );
  }

  const row = new ActionRowBuilder().addComponents(buttons);

  const { customId } = interaction;

  if (customId === 'yes-privacy-notice' || customId === 'no-privacy-notice' || customId === 'delete-privacy-notice') {
    await interaction.update({ ephemeral: true, embeds: [embed], components: [row] });
  } else {
    await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
  }
};

module.exports.loadAttendanceFromDB = async (eiaventId) => {
  const going = [];
  const notGoing = [];
  const maybe = [];
  const lft = [];
  const selling = [];

  const membersGoingInDB = await EventAttendance.findAll({
    where: {
      event_id: eiaventId,
      response: 'going',
    },
  });

  membersGoingInDB.forEach((g) => {
    going.push(g.dataValues.member_id);
  });

  const membersNotGoingInDB = await EventAttendance.findAll({
    where: {
      event_id: eiaventId,
      response: 'not-going',
    },
  });

  membersNotGoingInDB.forEach((g) => {
    notGoing.push(g.dataValues.member_id);
  });

  const membersMaybeInDB = await EventAttendance.findAll({
    where: {
      event_id: eiaventId,
      response: 'maybe',
    },
  });

  membersMaybeInDB.forEach((g) => {
    maybe.push(g.dataValues.member_id);
  });

  const membersLFTInDB = await EventAttendance.findAll({
    where: {
      event_id: eiaventId,
      response: 'lft',
    },
  });

  membersLFTInDB.forEach((g) => {
    lft.push(g.dataValues.member_id);
  });

  const membersSellingInDB = await EventAttendance.findAll({
    where: {
      event_id: eiaventId,
      response: 'selling',
    },
  });

  membersSellingInDB.forEach((g) => {
    selling.push(g.dataValues.member_id);
  });

  return {
    going, notGoing, maybe, lft, selling,
  };
};

module.exports.generateEIAventEmbed = async (eiaventId) => {
  const {
    going, notGoing, maybe, lft, selling,
  } = await this.loadAttendanceFromDB(eiaventId);

  const eventInDB = await Event.findByPk(eiaventId);

  const eiaventName = eventInDB.dataValues.event_name;
  const eiaventDescription = eventInDB.dataValues.event_description;
  const eiaventImage = eventInDB.dataValues.image_url;

  const embed = new EmbedBuilder()
    .setTitle(eiaventName)
    .setDescription(eiaventDescription);

  function isImage(url) {
    return /\.(jpg|jpeg|png|webp|gif|svg)$/.test(url);
  }

  if (eiaventImage.length > 0 && isImage(eiaventImage)) {
    embed.setImage(eiaventImage);
  }

  embed.setFooter({ text: eiaventId });

  going.forEach((member) => {
    going[going.indexOf(member)] = `<@!${member}>`;
  });

  for (const m of notGoing) {
    notGoing[notGoing.indexOf(m)] = `<@!${m}>`;
  }

  for (const m of maybe) {
    maybe[maybe.indexOf(m)] = `<@!${m}>`;
  }

  for (const m of lft) {
    lft[lft.indexOf(m)] = `<@!${m}>`;
  }

  for (const m of selling) {
    selling[selling.indexOf(m)] = `<@!${m}>`;
  }

  const attendanceFields = [
    {
      name: going.length > 0 ? `<:going:${emojis.GOING}> Going (${going.length})` : `<:going:${emojis.GOING}> Going`,
      value: going.length > 0 ? going.join('\n') : '-',
      inline: false,
    },
    {
      name: notGoing.length > 0 ? `<:not_going:${emojis.NOT_GOING}> Not going(${notGoing.length})` : `<:not_going:${emojis.NOT_GOING}> Not going`,
      value: notGoing.length > 0 ? notGoing.join('\n') : '-',
      inline: false,
    },
    {
      name: maybe.length > 0 ? `<:maybe:${emojis.MAYBE}> Maybe (${maybe.length})` : `<:maybe:${emojis.MAYBE}> Maybe`,
      value: maybe.length > 0 ? maybe.join('\\n') : '-',
      inline: false,
    },
    { name: '\u200b', value: '\u200b' },
    {
      name: lft.length > 0 ? `<:lft:${emojis.LFT}> LFT (${lft.length})` : `<:lft:${emojis.LFT}> LFT`,
      value: lft.length > 0 ? lft.join('\n') : '-',
      inline: false,
    },
    {
      name: selling.length > 0 ? `<:selling:${emojis.SELLING}> Selling (${selling.length})` : `<:selling:${emojis.SELLING}> Selling`,
      value: selling.length > 0 ? selling.join('\n') : '-',
      inline: false,
    },
  ];

  embed.addFields(attendanceFields);

  return embed;
};

module.exports.generateEIAventRow = () => {
  const buttons = [];

  Object.keys(emojis).forEach((emoji) => {
    buttons.push(
      new ButtonBuilder()
        .setCustomId(emoji)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(emojis[emoji]),
    );
  });

  return new ActionRowBuilder().addComponents(buttons);
};

module.exports.refreshAllEIAventEmbeds = async (interaction) => {
  const events = await Event.findAll();
  const row = this.generateEIAventRow();

  const { client } = interaction;

  // eslint-disable-next-line no-restricted-syntax
  for (const event of events) {
    const eiaventId = event.dataValues.event_id;
    const targetChannelId = event.dataValues.guild_channel_id;
    // eslint-disable-next-line no-await-in-loop
    const targetChannel = await client.channels.cache.get(targetChannelId);
    const targetMessageId = event.dataValues.message_id;
    // eslint-disable-next-line no-await-in-loop
    const targetMessage = await targetChannel.messages.fetch(targetMessageId);
    // eslint-disable-next-line no-await-in-loop
    const embed = await this.generateEIAventEmbed(eiaventId);
    // eslint-disable-next-line no-await-in-loop
    await targetMessage.edit({ ephemeral: false, embeds: [embed], components: [row] });
  }
};
