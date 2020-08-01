const Discord = require("discord.js")
const config = require("./config.json")
const Canvas = require("canvas")

const client = new Discord.Client({
    disableMentions: "everyone"
})
client.login(config.token)

client.on("ready", () => {
    console.log(`Бот был успешно запущен!`)
    client.user.setActivity("github.com/TheFerryn", { type: "WATCHING" })
})
client.on("guildMemberAdd", async (member) => {
    Canvas.registerFont(`fonts/BadScript-Regular.ttf`, { family: "BadScript" })
    let captcha = Math.random().toString(36).slice(2, 8)
    let canvas = Canvas.createCanvas(170, 50)
    let ctx = canvas.getContext("2d")

    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#000001"
    ctx.font = "35px BadScript"
    ctx.fillText(captcha, canvas.width / 5.5, canvas.height / 1.5)

    let msg = await member.send(
        "Добро пожаловать на сервер! Чтобы получить доступ ко всем каналам, пройдите пожалуйста капчу. У вас есть 1 минута.",
        new Discord.MessageAttachment(canvas.toBuffer(), "captcha.jpg")
      );
      try {
        let filter = (m) => {
          if (m.author.bot) return;
          if (m.author.id === member.id && m.content === captcha) return true;
          else {
            m.channel.send(
              "Вы не прошли капчу. Попробуйте пожалуйста снова."
            );
            return false;
          }
        };
        let res = await msg.channel.awaitMessages(filter, {
          max: 1,
          time: 60000,
          errors: ["time"],
        });
        if (res) {
          msg.channel.send(`Капча была успешно пройдена! Удачи на сервере ${member.guild.name}!`);
          member.roles.add(config.role);
        }
      } catch (err) {
        msg.channel.send(
          "Вы не успели пройти капчу и были кикнуты с сервера."
        );
        await member.kick();
      }
})
