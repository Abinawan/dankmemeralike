const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const db = require('quick.db');

// ...

if (command === 'daily') { // COMMAND: DAILY
      recentlyTalked = await db.fetch(`timee_${message.author.id}`); //Gets the previous claimed time.
      if (recentlyTalked === null) { //checks if previous claimed time was null (has never claimed daily coins)
        recentlyTalked = 0; //if null, keeps the value to 0
      }
      recentTime = Date.now(); // keeps the recent timestamp.
      diffTime = recentTime - recentlyTalked; // compares the previous and recent timestamp.
    
      if (diffTime <= 86400000) { // checks if the difference in timestamp is less or equal to 1 day or 86400000ms
        // if it is less (has claimed daily before next daily can be claimed)
        recentlyTalked = Math.round(recentlyTalked / 1000) + 86400; // divides the timestamp by 1000 to get UNIX timestamp and adds UNIX timstamp of 1 day
        const dailyRewardCoolDown = new MessageEmbed() // creates an embed message
          .setTitle('You\'ve already claimed your daily today') //sets title
          .setURL('https://discord.gg/<your-discord-invite-link>') // sets the url in the title
          .setDescription(`Your next daily is ready in:\n **<t:${recentlyTalked}:F> (<t:${recentlyTalked}:R>)**`) // sets the description; <t:${recentlyTalked}:F> shows the date when daily is available again; <t:${recentlyTalked}:R> shows after how long daily is available again
          .setTimestamp() // sets timestamp
        message.channel.send({ embeds: [dailyRewardCoolDown] }); //sends the embed
      } else { // if daily command was used after 1 day
        await db.add(`ecoin_${message.guild.id}_${message.author.id}`, 20000); //adds 20000 coins to users coin db (`ecoin` is just an example)
        const dailyReward = new MessageEmbed() // creates an embed message
          .setTitle(`${message.author.username}'s Daily Coins`) //setsTitle
          .setURL('https://discord.gg/<your-discord-invite-link>') //sets url in title
          .setDescription('**⏣ 20,000** was placed in your wallet!') // sets description
          .setTimestamp() // sets timestamp
        message.channel.send({ embeds: [dailyReward] }); // sends the embed
        db.delete(`timee_${message.author.id}`); // deletes the previous claimed time stamp
        db.set(`timee_${message.author.id}`, Date.now()); // creates new time stamp with the timestamp of recent time.
      }
    }
