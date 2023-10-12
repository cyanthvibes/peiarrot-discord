const {
  SlashCommandBuilder, TextInputStyle, ModalBuilder, TextInputBuilder, ActionRowBuilder,
} = require('discord.js');
const roles = require('../../../data/roles');

const { Event } = require('../../../database/sequelize');

module.exports = {
  required_roles: [roles.EVENT_MANAGER],
  data: new SlashCommandBuilder()
    .setName('event')
    .setDescription('Create or edit an event')
    .addSubcommand((subcommand) => subcommand
      .setName('create')
      .setDescription('Create a new event'))
    .addSubcommand((subcommand) => subcommand
      .setName('edit')
      .setDescription('Edit an existing event')
      .addStringOption((option) => option.setName('eiavent_id').setDescription('ID of event').setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('archive')
      .setDescription('Archive an event')
      .addStringOption((option) => option.setName('eiavent_id').setDescription('ID of event').setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('delete')
      .setDescription('Delete an event')
      .addStringOption((option) => option.setName('eiavent_id').setDescription('ID of event').setRequired(true)))
    .addSubcommand((subcommand) => subcommand
      .setName('restore')
      .setDescription('Restore a deleted event')
      .addStringOption((option) => option.setName('eiavent_id').setDescription('ID of event').setRequired(true))),

  async execute(interaction) {
    const { client } = interaction;

    if (interaction.options.getSubcommand() === 'create') {
      const modal = new ModalBuilder()
        .setCustomId('eiaventModal')
        .setTitle('New event!');

      const eiaventNameInput = new TextInputBuilder()
        .setCustomId('eiaventNameInput')
        .setLabel('What is the name of the event?')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const eiaventDescriptionInput = new TextInputBuilder()
        .setCustomId('eiaventDescriptionInput')
        .setLabel('What is the description of the event?')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const eiaventImageInput = new TextInputBuilder()
        .setCustomId('eiaventImageInput')
        .setLabel('Optional image URL png/jpg/jpeg/webp/gif/svg')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      const firstActionRow = new ActionRowBuilder().addComponents(eiaventNameInput);
      const secondActionRow = new ActionRowBuilder().addComponents(eiaventDescriptionInput);
      const thirdActionRow = new ActionRowBuilder().addComponents(eiaventImageInput);

      modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

      await interaction.showModal(modal);
    } else if (interaction.options.getSubcommand() === 'edit') {
      let event;
      try {
        event = await Event.findByPk(interaction.options.getString('eiavent_id'));
      } catch (e) {
        await interaction.reply({ content: 'I could not find an event with that ID', ephemeral: true });
        return;
      }

      const modal = new ModalBuilder()
        .setCustomId('eiaventModal')
        .setTitle('Editing event');

      const eiaventNameInput = new TextInputBuilder()
        .setCustomId('eiaventNameInput')
        .setLabel('What is the name of the event?')
        .setStyle(TextInputStyle.Short)
        .setValue(event.event_name)
        .setRequired(true);

      const eiaventDescriptionInput = new TextInputBuilder()
        .setCustomId('eiaventDescriptionInput')
        .setLabel('What is the description of the event?')
        .setStyle(TextInputStyle.Paragraph)
        .setValue(event.event_description)
        .setRequired(true);

      const eiaventImageInput = new TextInputBuilder()
        .setCustomId('eiaventImageInput')
        .setLabel('Optional image URL png/jpg/jpeg/webp/gif/svg')
        .setStyle(TextInputStyle.Short)
        .setValue(event.image_url)
        .setRequired(false);

      const eiaventIdInput = new TextInputBuilder()
        .setCustomId('eiaventIdInput')
        .setLabel('event_id, please don\'t change this :)')
        .setStyle(TextInputStyle.Short)
        .setValue(event.event_id)
        .setRequired(true);

      const firstActionRow = new ActionRowBuilder().addComponents(eiaventNameInput);
      const secondActionRow = new ActionRowBuilder().addComponents(eiaventDescriptionInput);
      const thirdActionRow = new ActionRowBuilder().addComponents(eiaventImageInput);
      const fourthActionRow = new ActionRowBuilder().addComponents(eiaventIdInput);

      modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

      await interaction.showModal(modal);
    } else if (interaction.options.getSubcommand() === 'archive') {
      let event;
      try {
        event = await Event.findByPk(interaction.options.getString('eiavent_id'));
        await Event.update({ archived: true }, { where: { event_id: interaction.options.getString('eiavent_id') } });
        await interaction.reply({ content: 'I have archived the event!', ephemeral: true });
      } catch (e) {
        await interaction.reply({ content: 'I could not find an event with that ID', ephemeral: true });
      }
    } else if (interaction.options.getSubcommand() === 'restore') {
      let event;
      try {
        event = await Event.findByPk(interaction.options.getString('eiavent_id'));
        await Event.update({ archived: false }, { where: { event_id: interaction.options.getString('eiavent_id') } });
        await interaction.reply({ content: 'I have restored the event!', ephemeral: true });
      } catch (e) {
        await interaction.reply({ content: 'I could not find an event with that ID', ephemeral: true });
      }
    } else if (interaction.options.getSubcommand() === 'delete') {
      let eventInDatabase;
      try {
        eventInDatabase = await Event.findByPk(interaction.options.getString('eiavent_id'));
        await Event.destroy({
          where: {
            event_id: eventInDatabase.event_id,
          },
        });
        const targetChannelId = eventInDatabase.dataValues.guild_channel_id;
        const targetChannel = client.channels.cache.get(targetChannelId);
        const targetMessageId = eventInDatabase.dataValues.message_id;
        const targetMessage = await targetChannel.messages.fetch(targetMessageId);
        await targetMessage.delete();
        await interaction.reply({ content: 'I have deleted the event!', ephemeral: true });
      } catch (e) {
        await interaction.reply({ content: 'I could not find an event with that ID', ephemeral: true });
      }
    }
  },
};
