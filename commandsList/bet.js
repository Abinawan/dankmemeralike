const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const db = require('quick.db');
//...

if (command === "bet" || command === "gamble") { // COMMAND: BET
      if (message.member.roles.cache.some(role => role.name === 'Server Booster')) { // checks if user has Server Booster role
        betCooldownTime = 5000; // Keeps the cooldown to 5sec for server booster
      } else { 
        betCooldownTime = 8000; // Keeps the cooldown to 8 sec for normal people
      }
      betCooldownPreviousTime = await db.get(`betCooldownPreviousTime${message.author.id}`); // 
      betCooldownRemaining = Date.now() - betCooldownPreviousTime;
      if (betCooldownRemaining < betCooldownTime) {
        var warningTitles = ["Woah now, slow it down", "Hold your horses...", "Woah nelly, slow it down", "Take a chill pill", "Too spicy, take a breather", "Chill mate"]
        const betCooldown = new MessageEmbed()
          .setTitle(warningTitles[Math.floor(Math.random() * warningTitles.length)])
          .setDescription(`If I let you bet whenever you wanted, you'd be a lot more poor. Wait **${Math.round((betCooldownTime - betCooldownRemaining) / 1000)} seconds**
                    The default cooldown is \`8s\`, but [**Server Boosters**](https://discord.gg/R2cYZe3tKG) only need to wait \`5s\`!`)
        return message.reply({ embeds: [betCooldown] });
      } else {
        if (!args[0]) {
          return message.channel.send(`${message.author} You need to bet something.`)
        }
        balanceofuser = await db.get(`ecoin_${message.guild.id}_${message.author.id}`)
        if (balanceofuser === 0) {
          return message.channel.send(`${message.author} You have no coins in your wallet to gamble with lol.`);
        }
        if (args[0] === "all") {
          args[0] = balanceofuser;
        } else if (isNaN(args[0])) {
          return message.channel.send(`${message.author} You can use only numeric value`);
        }
        args[0] = Math.round(args[0]);
        if (args[0] < 1500) {
          return message.channel.send(`${message.author} You can't bet less than **⏣ 1,500**, sorry not sorry`)
        } else if (args[0] > 250000) {
          return message.channel.send(`${message.author} You can't bet more than **⏣ 250,000**, don't try to lose em all`);
        }
        coinsusedonbetting = args[0];
        xbotBet = Math.floor(Math.random() * 13);
        xuserBet = Math.floor(Math.random() * 13);
        while (xbotBet === xuserBet) {
          xuserBet = Math.floor(Math.random() * 13);
        }
        if (xbotBet > xuserBet) {
          db.subtract(`ecoin_${message.guild.id}_${message.author.id}`, args[0]);
          coinsafterlosing = db.get(`ecoin_${message.guild.id}_${message.author.id}`);
          const botwinsbet = new MessageEmbed()
            .setColor('#c7181d')
            .setAuthor({ name: `${message.author.username}'s losing gambling game`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
            .setDescription(`\nYou lost **⏣ ${coinsusedonbetting.toLocaleString()}**\n\n**New Balance**: ⏣ ${coinsafterlosing.toLocaleString()}`)
            .addFields(
              { name: `${message.author.username}`, value: `Rolled \`${xuserBet}\``, inline: true },
              { name: "Bot", value: `Rolled \`${xbotBet}\``, inline: true }
            )
          message.channel.send({ embeds: [botwinsbet] })
        } else if (xbotBet < xuserBet) {
          db.add(`ecoin_${message.guild.id}_${message.author.id}`, args[0]);
          coinsafterlosing = db.get(`ecoin_${message.guild.id}_${message.author.id}`);
          const userwinsbet = new MessageEmbed()
            .setColor('#2b993c')
            .setAuthor({ name: `${message.author.username}'s winning gambling game`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
            .setDescription(`\nYou won **⏣ ${coinsusedonbetting.toLocaleString()}**\n\n**New Balance**: ⏣ ${coinsafterlosing.toLocaleString()}`)
            .addFields(
              { name: `${message.author.username}`, value: `Rolled \`${xuserBet}\``, inline: true },
              { name: "Bot", value: `Rolled \`${xbotBet}\``, inline: true }
            )
          message.channel.send({ embeds: [userwinsbet] })
        }
        db.delete(`betCooldownPreviousTime${message.author.id}`);
        db.set(`betCooldownPreviousTime${message.author.id}`, Date.now());
      }
    }
