// This event is fired when our bot is logged in and ready

const { ActivityType } = require('discord.js');

module.exports = {
  execute(client) {
    console.log(`Logged in as ${client.user.tag}`);

    let state = 0;
    const i = 0;

    const presences = [
      {
        activity: 'drum and bass',
        type: ActivityType.Listening,
      },
      {
        activity: i,
        type: ActivityType.Watching,
      },
      {
        activity: '/help',
        type: ActivityType.Listening,
      },
    ];

    setInterval(async () => {
      state = (state + 1) % presences.length;

      presences[1].activity = String(`${
        await (await client.guilds.fetch(client.config.GUILD_ID)).members.fetch().then(
          (members) => members.filter((member) => !member.user.bot).size,
        )
      } people`);

      client.user.setActivity(presences[state].activity, {
        type: presences[state].type,
      });
    }, 15_000);
  },
};
