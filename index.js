const Discord = require("discord.js");
const config = require("./config.json");
const cron = require("node-cron");
const request = require("request");

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING"],
});

const requestOptions = [
  {
    method: "GET",
    url: "http://neotokyo.codes",
  },
  {
    method: "GET",
    url: "https://neotokyo.codes/elite-entry",
  },
  {
    method: "GET",
    url: "http://deathandsunshine.com",
  },
  {
    method: "GET",
    url: "http://elliosfarm.bar",
  },
  {
    method: "GET",
    url: "http://laststopbeforehell.club",
  },
  {
    method: "GET",
    url: "http://purgatory.club",
  },
  {
    method: "GET",
    url: "http://theemptyhouse.com",
  },
  {
    method: "GET",
    url: "http://unbarleivable.club",
  },
];

var channel;
var role;

const prefix = "!";

var webState = [requestOptions.length];
var newState = [requestOptions.length];
var pingCd = [requestOptions.length];

for (let i = 0; i < requestOptions.length; i++) {
  pingCd[i] = -1;
  request(requestOptions[i], function (error, response, body) {
    if (error) throw new Error(error);
    webState[i] = body;
  });
}

client.on("ready", () => {
  channel = client.channels.cache.get("<Channel Id>");
  console.log("ready on channel " + channel.id);
  channel.send("Up for some pills ?");
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.channel !== channel) return;
  if (!msg.content.startsWith(prefix)) return;

  let args = msg.content.substring(prefix.length).split(" ");
  let command = args[0];

  if (command === "pill") {
    role = msg.guild.roles.cache.find((role) => role.name === "Neo-Bot-Warnings");
    msg.reply("So you're taking the red pill huh?");
    msg.member.roles.add(role);
  }
});

//Run the check each 13 seconds
cron.schedule("*/13 * * * * *", () => {
  for (let i = 0; i < requestOptions.length; i++) {
    request(requestOptions[i], function (error, response, body) {
      if (error) throw new Error(error);
      newState[i] = body;
      if (pingCd[i] > 0 || (newState[i] !== undefined && newState[i] != webState[i])) {
        if (pingCd[i] === -1) {
          webState[i] = newState[i];
          pingCd[i] = 5;
        }
        channel.send("<@&Role Id> THE WEBSITE " + requestOptions[i].url + " CHANGED !!!");
      }
      if (pingCd[i] >= 0) pingCd[i]--;
    });
  }
});

client.login(config.BOT_TOKEN);
