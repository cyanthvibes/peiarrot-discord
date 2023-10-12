const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows a list of all commands or info about a specific command.')
    .addStringOption((option) => option
      .setName('command')
      .setDescription('The specific command to see the info of.')
      .setAutocomplete(true))
    .setDMPermission(true),

  async execute(interaction) {
    const commands = interaction.client.slashCommands;
    let name = interaction.options.getString('command');

    const embed = new EmbedBuilder().setColor('Random');

    if (name) {
      name = name.toLowerCase();
      embed.setTitle(`Help for \`${name}\` command`);
      if (commands.has(name)) {
        const command = commands.get(name).data;

        if (command.description) {
          if (command.options.length > 0) {
            embed.setDescription(`${command.description}\n\n**Arguments for** \`${name}\`**:**`);

            command.options.forEach((option) => {
              let content = option.description;
              if (option.choices) {
                let choices = '\n\nChoices: ';

                option.choices.forEach((choice) => {
                  choices += `${choice.name}, `;
                });

                choices = choices.slice(0, -2);
                content += choices;
              }

              if (!option.required && option.constructor.name !== 'SlashCommandSubcommandBuilder') {
                content += '\n*Optional*';
              } else if (option.required && option.constructor.name !== 'SlashCommandSubcommandBuilder') {
                content += '\n*Required*';
              }

              embed.addFields({ name: option.name, value: content.trim(), inline: true });
            });
          } else {
            embed.setDescription(`${command.description}`);
          }
        }
      } else {
        embed.setColor('Random');
        embed.setDescription(`No command with the name \`${name}\` found.`);
      }
    } else {
      embed
        .setTitle('Here\'s a list of all my commands:')
        .setDescription(
          `\`${
            interaction.client.slashCommands
              .map((command) => command.data.name)
              .join('`, `')
          }\``,
        );
    }

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
