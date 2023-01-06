const {
  Sequelize,
  DataTypes,
} = require('sequelize');

require('dotenv').config();

const config = require('../config');

const sequelize = new Sequelize(`postgres://${config.DATABASE_USERNAME}:${config.DATABASE_PASSWORD}@localhost:${config.DATABASE_PORT}`, {
  logging: false,
});

const Member = sequelize.define(
  'Member',
  {
    member_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  },
);

const Event = sequelize.define(
  'Event',
  {
    event_id: {
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.STRING,
      primaryKey: true,
    },
    event_name: {
      type: DataTypes.STRING,
    },
    event_description: {
      type: DataTypes.STRING,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    guild_channel_id: {
      type: DataTypes.STRING,
    },
    message_id: {
      type: DataTypes.STRING,
    },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
);

const EventAttendance = sequelize.define(
  'Attendance',
  {
    member_id: {
      type: DataTypes.STRING,
      references: {
        model: Member,
        key: 'member_id',
      },
      onDelete: 'cascade',
      hooks: true,
    },
    event_id: {
      type: DataTypes.STRING,
      references: {
        model: Event,
        key: 'event_id',
      },
      onDelete: 'cascade',
      hooks: true,
    },
    response: {
      type: DataTypes.STRING,
    },
  },
);

Member.hasMany(EventAttendance);
EventAttendance.belongsTo(Member);

Event.hasMany(EventAttendance);
EventAttendance.belongsTo(Event);

module.exports = {
  sequelize,
  Member,
  Event,
  EventAttendance,
};
