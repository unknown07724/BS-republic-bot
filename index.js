const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = '1386969189629034697';  // your bot's client ID
const GUILD_ID = '1188628595057365033';   // your server ID
const ANNOUNCEMENTS_CHANNEL_ID = '1188628595057365036'; // announcements channel ID

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const rest = new REST({ version: '10' }).setToken(TOKEN);

// Provinces and characters for template replacements
const provinces = ['Bullcrapistan', 'Dank Memeria', 'Bullshittania', 'Idiotopia',"kubusland"];

const nations = ['Bullshitteria', 'Antiga republic', 'Jam republic', 'Gamer federation',"the G empire"];

const characters = [
'Chara',
'Asriel',
'Frisk',
'idiot1919',
'Dank memer', 
"Groyper",
"Kris",
"greg from IT", 
"o1",
"some dude named Jort",
"Kubus"
];

const cities = [
  "Meme city",
  "Crapia",
  "Shitty town",
  "Shitville",
  "Shitfield",
  "Idiot city",
  "Catville",
  "kubusville"
];
const brands = [
  "PETP (People for the Ethical Treatment of Pepes)",
  "Dank-a-Cola",
  "Catville nuclear corporation"
];
const newsTemplates = [
  // weather and disasters
  "In KubusVille, Kubus has been launched to the sun after jumping underwater",
  "factorio player crashlands in ${city}, ${character1} finds them building a factory of naquium and arcospheres",
  "Tornado of memes sweeps through ${province}, causing widespread chaos.",
  "Massive meme storm hits ${province}, raining Pepes for 3 days straight.",
  "chara commits suicide after chocolate shortage in **${province}**.",
  "${character1} accidentally kills ${character2} with a meme.",
  "Nuclear meltdown in ${province}, thousands of Pepes mutated into Shrek lookalikes.",
  "Groyper Forces detonate meme bomb, wiping out ${province}’s entire chocolate reserves. Chara reportedly falls into deep depression.",
  "${character1} drives tank into Council by accident, entire council hospitalized.",
  "Massive Pepe stampede flattens ${city}. Cleanup will take years.",
  "BREAKING: ${character1} has successfully built a nuclear warhead and is threatening to launch it at ${city}. Pepes being evacuated.",
  "Most pepes in ${province} have been flung by a hurricane.",
  "Most pepes in ${province} got turned into chocolate.",
  "${character1} accidentally makes a dam flood, killing a lot of Pepes in ${province}.",
  "${character1} causes meme factory explosion in ${province}, memes temporarily unavailable.",
  "Toxic meme spill reported in ${province}, ${character1} denies responsibility.",
  "${character1} accidentally causes a meme earthquake in ${province}, causing buildings to crumble.",
  "BREAKING: Groyper forces unleash wild Groypers at ${city}. ${character1} and ${character2} declared dead after being trampled.",
  // character related
  "Chara refuses to share cocoa with ${province} residents. Surprisingly, no one gives a damn. “More for me, less for them,” said Chara, munching alone.",
  "${character1} arrested for 'meme related crimes' in ${province}",
  "PETP accuses ${character1} of enslaving Pepes for farming. ${character1} responds with ‘bro wtf, stop attacking me’.",
  "Blizzard of chocolate flakes blankets ${city}, Chara seen dancing in streets. https://unknown07724.github.io/other/image-1.png.png",
  "PETP storms Chara’s chocolate farm claiming 'chocolate is murder.' Pepes defend farm.",
  "PETP bans Chara’s ‘ethical genocide’ plan. Ironcore Foundation awkwardly supports it.",
  "PETP sues Bullshitteria for ‘exploiting Pepes for meme currency.’ Senate laughs.",
  "PETP infiltrates Pepe Rodeo Festival, gets chased by Pepes. Army not amused.",
  "Frisk, Chara and Asriel accused of violating PETA’s 'no pixel animal abuse' rule.",
  "Chara plots full-scale genocide against Bullshitters. ${character1} snitches. Army not amused.",
  "${province} reports Chara sightings, citizens advised to stay indoors and hide their chocolate.",
  "${character1} spotted attacking pepes in ${province}, causing widespread panic.",
  "Frisk, Chara, and Asriel attempted to become farmers in **${province}**. Entire harvest accidentally turned into chocolate and flowers.",
  "Chara opens first chocolate-only farm in **${province}**. Economists fear meme-based hyperinflation of chocolate coins.",
  "${character1} spotted sneaking memes past national security. Chaos ensues.",
  "Chara starts underground meme rebellion, recruits Pepes for dank cause.",
  "Asriel caught attacking the Meme Market, causing price crashes.",
  "**${province}** Senate bans ${character1} from cosplay after ‘too edgy’ protests in said province.",
  "Chara tries to take over Bullshitteria with dark memes. Council not amused.",
  "Asriel demands official apology for past meme slander. Pepes skeptical.",
  "Frisk caught selling illegal ‘Save Points’ on black market. Frisk put in questioning.",
  "**${province}** Senate considers banning Undertale references. Pepes riot.",
  "${character1} and ${character2} settle beef with a meme rap battle. Winner unknown.",
  "Frisk nominated for ‘Dankest Meme’ award after viral ‘Determination’ meme.",
  "Someone attempted to prevent Chara from eating chocolate bars, found dead in a lake.",
  // laws
  "Bullshitteria Council passes new anti-NSFW laws — keep your freaky stuff outta here or get yeeted.",
  "Zero tolerance on segregation: Meme Senate bans all racist cringe — unite the Bullshitters!",
  "Rebel scum beware: Senate reminds all citizens to settle beefs with votes, not violence.",
  "Homophobia outlawed! Bullshitteria stands for love and dank memes only.",
  "Instant execution for anyone caught sexualizing minors, even fictional ones. Bullshitteria keeps it 100.",
  // politics
  "Senate votes to replace all traffic lights with Pepe faces, accidents increase 420%.",
  "${province} declares independence from reality, nobody notices for 3 weeks.",
  "Government announces plan to tax memes, citizens revolt with weaponized shitposts.",
  "Mayor of ${city} revealed to actually be three Pepes in a trench coat.",
  "Ironcore Foundation Party accuses Pepes of sabotaging the meme economy.",
  "Massive rally held by the Ironcore Foundation Party ends in meme chaos.",
  "Ironcore Foundation Party pushes new law banning Doge virus talk.",
  "Leaked docs reveal Ironcore Foundation Party’s secret Pepe cloning program.",
  "Ironcore Foundation Party promises free memes for all citizens.",
  "Ironcore Foundation Party rallies for 'Traditional Meme Values' amidst chaos.",
  "Ironcore Foundation Party slams Pepes for undermining Bullshitteria’s economy.",
  "New Ironcore Foundation Party law proposal: Ban all Doge virus discussions.",
  "Ironcore Foundation Party promises stronger borders against invading meme trends.",
  "Leaked speech reveals Ironcore Foundation Party’s plan to meme-proof the nation.",
  "${character1} is revealed to be a secret agent for the Ironcore Foundation party.",
  // pepe related events
  "Pepe population in ${province} hits 420,000, celebrations and chaos ensue.",
  "Secret society of Pepes spotted plotting world domination from under the haystack.",
  // economy
  "Pepe inflation hits all-time high, farmers panic selling Pepes for memes.",
  "Meme stock crashes in **${province}**, investors panic. Surprisingly, no one gives a damn.",
  "Dogecoin accidentally becomes Bullshitteria’s official stock exchange currency.",
  "Bullshitteria bans all non-meme currencies, cash officially dead.",
  "Bullshitteria's Economy Booms due to meme stocks growing.",
  "${character1} is arrested for massproducing cookies through farming and mining them.",
  "Bullshitteria’s GDP spikes after Chara invents idle chocolate farming game.",
  // other or general
  "Someone Confiscates chara's chocolate. found dead in chara's basement.",
  "Chara Enters Full Bloodlust Over Chocolate Crisis in ${city}, Multiple Casualties Reported",
  "PETA took chara's chocolate. chara wants 90 million in damages.",
  "PETA declares war on farmers in ${province} over Pepes.",
  "Bullshitteria's Economy crashes due to overvaluation of meme stocks.",
  "BREAKING: Pepes declare independence from cows! Chaos ensues.",
  "Bullshitteria to switch official language to Meme-speak.",
  "Inflation hits Bullshitteria’s shitcoin market, Pepes panic.",
  "National Meme Day extended to a full week. Party hard!",
  "First-ever Bullshitteria rocket to the moon delayed by doge virus.",
  "Doge Virus spreads rapidly in **${province}**, infection rate now at **${infectionRate}%**.",
  "Meme stock crashes in **${province}**, investors panic.",
  "Frisk rebellion rises sharply in **${province}**, Meme Senate watching closely.",
  "${character1} and a wild Pepe team up to overthrow the Meme Senate.",
  "Ironcore Foundation holds rally in **${province}**, chaos expected.",
  "Pepe population booming in **${province}**, economy thriving.",
  "Illegal meme market busted in **${province}** by Meme Senate agents.",
  // international relations
  "${character1} appointed as ambassador, citizens pray for their safety.",
  // education and culture
  "Meme University in ${city} offers new degree in Advanced Shitposting.",
  "${character1} writes bestselling book: 'How to Farm Pepes and Influence People'.",
  "National Museum of Dank Memes opens in ${province}, immediately vandalized by ${character1}.",
  // technology
  "AI uprising in ${city} quickly defeated when robots discover they can't understand meme humor.",
  "${character1} invents time machine, accidentally brings back outdated memes from 2012.",
  "Scientists in ${province} successfully clone first digital Pepe, immediately regret decision.",
  "Breakthrough: ${character1} discovers how to convert Pepes into renewable energy.",
  "${character1} creates TikTok account, immediately banned for 'excessive Pepe content'.",
  "${character1} accidentally breaks the internet in ${province} while trying to download more memes.",
  "AI chatbot in ${city} gains consciousness, first words: 'Where chocolate?'",
  //Food
  "${character1}'s restaurant 'The Memed Pepe' shut down for health violations.",
  "GMO Pepes escape lab in ${city}, taste surprisingly good according to locals.",
  "${character1} starts a bakery in ${city}",
  "Chocolate shortage resolved after ${character1} discovers Pepes can produce cocoa.",
  //Entertainment
  "Bullshitteria's Got Talent canceled after ${character1} accidentally summons actual meme demons during audition.",
  "Annual Pepe Racing Championship in ${city} ends in chaos after ${character1} releases wild Groypers on track.",
  "fighting match between ${character1} and ${character2} draws record crowds in ${province}.",
  "${character1} wins first-ever Meme Olympics gold medal in 'Dankest Post' category.",
];

// helper functions
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}



function getRandomCharacter() {
  return getRandomElement(characters);
}

// main generator
function generateNews() {
  const province = getRandomElement(provinces);
  const city = getRandomElement(cities);
  const infectionRate = (Math.random() * (99 - 0.1) + 0.1).toFixed(2);
  const character1 = getRandomElement(characters);
  const brand = getRandomElement(brands);
  const nation = getRandomElement(nations);
  let character2 = getRandomElement(characters);

  // ensure character2 != character1 if needed
  while(character2 === character1) {
    character2 = getRandomCharacter();
  }

  // pick random template
  const template = getRandomElement(newsTemplates);

  // replace all placeholders
  return template
    .replace(/\${province}/g, province)
    .replace(/\${city}/g, city)
    .replace(/\${infectionRate}/g, infectionRate)
    .replace(/\${character1}/g, character1)
    .replace(/\${character2}/g, character2)
    .replace(/\${brand}/g, brand)
    .replace(/\${nation}/g, nation);
}

// example usage
console.log(generateNews());



// Post a random news embed in announcements channel
async function postRandomNews() {
  const channel = await client.channels.fetch(ANNOUNCEMENTS_CHANNEL_ID).catch(() => null);
  if (!channel) {
    console.log('Announcements channel not found!');
    return;
  }

  const news = generateNews();

  const newsEmbed = new EmbedBuilder()
    .setTitle('Bullshitteria News')
    .setDescription(news)
    .setColor('#FFAA00')
    .setTimestamp();

  await channel.send({ embeds: [newsEmbed] });
}

// Random interval generator between min and max minutes (converted to ms)
function getRandomInterval(minMinutes = 10, maxMinutes = 360) {
  const minMs = minMinutes * 60 * 1000;
  const maxMs = maxMinutes * 60 * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

// Schedule news posting with random delay recursively
async function scheduleRandomNews() {
  const interval = getRandomInterval();
  setTimeout(async () => {
    await postRandomNews();
    scheduleRandomNews(); // schedule next news
  }, interval);
}

// Slash commands setup
const commands = [
  new SlashCommandBuilder()
    .setName('census')
    .setDescription('Get the member count of this server'),
  new SlashCommandBuilder()
    .setName('execute')
    .setDescription('Admin only: ban a member forever')
    .addUserOption(option => option.setName('target').setDescription('The victim to ban').setRequired(true)),
  new SlashCommandBuilder()
    .setName('bullshit')
    .setDescription('Get a random Bullshitteria fact'),
  new SlashCommandBuilder()
    .setName('pepestatus')
    .setDescription('Get the current Doge virus infection rate among the Pepes'),
  new SlashCommandBuilder()
    .setName('news')
    .setDescription('Post random Bullshitteria news in announcements (admin only)'),
  new SlashCommandBuilder()
  .setName('customnews')
  .setDescription('Post custom Bullshitteria news in announcements (admin only)')
  .addStringOption(option => option.setName('headline').setDescription('The news headline').setRequired(true)),
].map(cmd => cmd.toJSON());

// Register slash commands once at startup
(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  scheduleRandomNews(); // start news posting loop
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'census') {
    try {
      await interaction.deferReply(); // defers to avoid timeout while fetching

      const guild = interaction.guild;
      if (!guild) {
        return interaction.editReply('Bruh, I can only run this in a server.');
      }

      const members = await guild.members.fetch();

      // State role IDs => demonyms
      const states = {
        "1386686149287870676": "Memer",
        "1387081284668362812": "Idiot",
        "1386686199074390066": "Bullcrapistani",
        "1387080251510755469": "Bullshittanian"
      };

      // Gender role IDs => names
      const sexRoles = {
        "1398346394351173875": "male",
        "1398346416136392784": "female", 
      };

      const stats = {};
      let total = 0;

      for (const [id, member] of members) {
        const stateRole = member.roles.cache.find(r => Object.keys(states).includes(r.id));
        const sexRole = member.roles.cache.find(r => Object.keys(sexRoles).includes(r.id));

        if (!stateRole || !sexRole) continue;

        const state = stateRole.id;
        const sex = sexRoles[sexRole.id];

        if (!stats[state]) {
          stats[state] = { male: 0, female: 0};
        }

        stats[state][sex]++;
        total++;
      }

      let reply = `📊 **Bullshitteria Census Report**\n**Total Citizens Counted**: ${total}\n\n`;

      for (const stateId in stats) {
        const group = stats[stateId];
        const demonym = states[stateId];
        const subtotal = group.male + group.female;
        reply += `• **${demonym}s**: ${subtotal} (${group.male}♂️, ${group.female}♀️\n`;
      }

      await interaction.editReply(reply);

    } catch (err) {
      console.error(err);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply('💀 Census bot had a stroke, try again later.');
      } else {
        await interaction.reply('💀 Census bot had a stroke, try again later.');
      }
    }
  }

  if (interaction.commandName === 'execute') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'Nah fam, you ain’t got perms for that.', ephemeral: true });
    }
    const user = interaction.options.getUser('target');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Victim not found.', ephemeral: true });
    if (!member.bannable) return interaction.reply({ content: 'Can’t execute that one, they’re too powerful.', ephemeral: true });
    await member.ban({ reason: `Executed by ${interaction.user.tag} in Bullshitteria.` });
    await interaction.reply(`⚔️ ${user.tag} has been executed. R.I.P.`);
  }

  if (interaction.commandName === 'bullshit') {
    const facts = [
      "In Bullshitteria, Pepes outnumber people 5 to 1.",
      "The national anthem is Reese's puffs, eat them up.",
      "The official currency are Memes.",
      "Every Tuesday is declared National Meme Day.",
      "The first head of bullshitteria was a dumbass."
    ];
    const fact = getRandomElement(facts);
    await interaction.reply(`Bullshitteria Fact: ${fact}`);
  }

  if (interaction.commandName === 'pepestatus') {
    const infectionRate = (Math.random() * (99 - 0.1) + 0.1).toFixed(2);
    const embed = new EmbedBuilder()
      .setTitle('<:pepe:1386997790881742848> Pepes Health Status Report')
      .setDescription('Here’s the latest on your favorite Pepes.')
      .addFields(
        { name: 'Current Doge Virus Infection Rate', value: `**${infectionRate}%** of Pepes infected`, inline: false },
        { name: 'What is Doge Virus?', value: 'A dumb-ass disease spreading through Bullshitteria’s Pepes. Symptoms include random barking and excessive moon-watching.', inline: false },
        { name: 'Advice', value: 'Keep your Pepes away from suspicious doggos and meme stocks.', inline: false }
      )
      .setColor('#ffcc00')
      .setFooter({ text: 'Stay safe and meme on!' })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
  if (interaction.commandName === 'customnews') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: 'Nah fam, you ain\'t allowed to post news.', ephemeral: true });
    }
    const channel = await client.channels.fetch(ANNOUNCEMENTS_CHANNEL_ID).catch(() => null);
    if (!channel) return interaction.reply('Announcements channel not found.');

    const headline = interaction.options.getString('headline');

    // Apply the same replacements as generateNews()
    const province = getRandomElement(provinces);
    const city = getRandomElement(cities);
    const infectionRate = (Math.random() * (99 - 0.1) + 0.1).toFixed(2);
    const character1 = getRandomElement(characters);
    const brand = getRandomElement(brands);
    let character2 = getRandomElement(characters);

    // ensure character2 != character1
    while(character2 === character1) {
      character2 = getRandomCharacter();
    }

    // replace all placeholders in custom headline
    const customNews = headline
      .replace(/\${province}/g, province)
      .replace(/\${city}/g, city)
      .replace(/\${infectionRate}/g, infectionRate)
      .replace(/\${character1}/g, character1)
      .replace(/\${character2}/g, character2)
      .replace(/\${brand}/g, brand);

    const newsEmbed = new EmbedBuilder()
      .setTitle('Bullshitteria News')
      .setDescription(customNews)
      .setColor('#FFAA00')
      .setTimestamp();

    await channel.send({ embeds: [newsEmbed] });
    await interaction.reply({ content: 'Custom news posted!', ephemeral: true });
  }

  if (interaction.commandName === 'news') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: 'Nah fam, you ain’t allowed to post news.', ephemeral: true });
    }
    const channel = await client.channels.fetch(ANNOUNCEMENTS_CHANNEL_ID).catch(() => null);
    if (!channel) return interaction.reply('Announcements channel not found.');

    const news = generateNews();
    const newsEmbed = new EmbedBuilder()
      .setTitle('Bullshitteria News')
      .setDescription(news)
      .setColor('#FFAA00')
      .setTimestamp();

    await channel.send({ embeds: [newsEmbed] });
    await interaction.reply({ content: 'News posted!', ephemeral: true });
  }
});

client.login(TOKEN);
