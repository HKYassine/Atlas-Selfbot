
function titlise(title) {
    if (process.platform == 'win32') {
        process.title = title;
    } else {
        process.stdout.write('\x1b]2;' + title + '\x1b\x5c');
    }    
}



console.log("Chargement de Atlas...")

titlise("Chargement du Selfbot")

const chalk = require('chalk');
const conserr = chalk.bold.bgRed;
try {
    eval("require")("./config")
} catch (error) {
    console.clear()
    console.log(conserr("Je ne trouve pas le fichier config.js. Veuillez le retélécharger."))
}

const version = "Beta"
const dev = "HK"
const selfbot = require("./selfbot.js")
const client = new selfbot.Client()
global["ClientDataResolver"] = client.resolver
const config = eval("require")("./config.js")
const configpath =  "./config.json"
const atlas = require("./atlas-selfbot")
const fs = require("fs")
const boxen = require('boxen');
const qs = require("querystring")
const timedate = require("timestamp-to-date")
const token = config.token
const prefix = config.prefix
const fetch = require("node-fetch")
const retroText = require('./retrotext.js')
const os = require("os")
const b64 = require("base-64")
const utf8 = require("utf8")
const beautify = require("beautify")
const backup = require("./atlas-backup")
const rpcGenerator = require("discordrpcgenerator")
const neko = require("./nekoapi")
const uuid = ()=>([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16))
const _RichEmbed = selfbot.RichEmbed
const appdata_path = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
let defolt = {
    color: "#01A9DB",
    safemod: false,
    twitch: "atlasselfbot",
    adblock: false,
}
if(!fs.existsSync(`${appdata_path}/Atlas Selfbot/config.json`)){
    fs.mkdirSync(`${appdata_path}/Atlas Selfbot`, {recursive: true})
    fs.writeFileSync(`${appdata_path}/Atlas Selfbot/config.json`, beautify(JSON.stringify(defolt), {format: 'json'}))
    var firstime = true
} else var firstime = false

if(!fs.existsSync(`${appdata_path}/Atlas Selfbot/backups/`)){
    fs.mkdirSync(`${appdata_path}/Atlas Selfbot/backups/`, {recursive: true})
    var firstime = true
} else var firstime = false

try {
    JSON.parse(fs.readFileSync(`${appdata_path}/Atlas Selfbot/config.json`))
} catch (error) {
    fs.unlinkSync(`${appdata_path}/Atlas Selfbot/config.json`)
    fs.writeFileSync(`${appdata_path}/Atlas Selfbot/config.json`, beautify(JSON.stringify(defolt), {format: 'json'}))
}

    
const possible_colors = ["DEFAULT", "WHITE", "AQUA", "GREEN", "BLUE", "PURPLE", "LUMINOUS_VIVID_PINK", "GOLD",
"ORANGE", "RED", "GREY", "NAVY", "DARK_AQUA", "DARK_GREEN", "DARK_BLUE", "DARK_BLUE", "DARK_PURPLE", "DARK_VIVID_PINK",
"DARK_GOLD", "DARK_ORANGE", "DARK_RED", "DARK_GREY", "DARK_GREY", "DARKER_GREY", "LIGHT_GREY", "DARK_NAVY", "BLURPLE",
"GREYPLE", "DARK_BUT_NOT_BLACK", "NOT_QUITE_BLACK"]


const jsonconf = JSON.parse(fs.readFileSync(`${appdata_path}/Atlas Selfbot/config.json`))
const Constants = require('./node_modules/selfbot.js/src/util/Constants');

var twitch = jsonconf.twitch
var safe = jsonconf.safemod
var color = "#01A9DB"
var adblock = jsonconf.adblock


if (!token) {
    titlise("Atlas Selfbot | Erreur")
    console.log(conserr("Une erreur a été détéctée au niveau du fichier de configuration. Vous n'avez pas fournit de token. \nVeuillez remplir le champs qui y est déstiné puis redémarrer le selfbot."))
    process.exit()
}
if (!twitch) {
    jsonconf.twitch = "atlasselfbot"
            fs.writeFileSync(`${appdata_path}/Atlas Selfbot/config.json`, beautify(JSON.stringify(jsonconf), {format: 'json'}), function writeJSON(err) {
                if (err) return console.log(err);
              });
    var twitch = jsonconf.twitch
}

if (!safe || typeof(safe) != typeof(true)) {
    jsonconf.safemod = false
            fs.writeFileSync(`${appdata_path}/Atlas Selfbot/config.json`, beautify(JSON.stringify(jsonconf), {format: 'json'}), function writeJSON(err) {
                if (err) return console.log(err);
              });
    var safe = jsonconf.safe
}
if (!adblock || typeof(adblock) != typeof(true)) {
    jsonconf.adblock = false
            fs.writeFileSync(`${appdata_path}/Atlas Selfbot/config.json`, beautify(JSON.stringify(jsonconf), {format: 'json'}), function writeJSON(err) {
                if (err) return console.log(err);
              });
    var adblock = jsonconf.adblock
 }
if (!prefix) {
    titlise("Atlas Selfbot | Erreur")
    console.log(conserr("Une erreur a été détéctée au niveau du fichier de configuration. Vous n'avez pas fournit de prefix. \nVeuillez remplir le champs qui y est déstiné puis redémarrer le selfbot."))
    process.exit()
}
if(safe){
    selfbot.RichEmbed = require("./TextEmbed")
}
if (config.style === true) {
    var stylist = "Oui"
} else if (config.style === false) {
    var stylist = "Non"
}
 
client.login(token).catch(e => {
    if (e.message === "Incorrect login details were provided.") {
        titlise("Atlas Selfbot | Erreur")
        console.clear()
        console.log(conserr("Une erreur est survenue au niveau du fichier de configuration. Le token saisi est incorrect."))
    } else {
        titlise("Atlas Selfbot | Erreur")
        console.clear()
        console.log(conserr(`Une erreur est survenue au niveau de la connexion a discord. Erreur : \n${e.message}`))
    }
    
})

client.on("ready", async () => {
    console.clear()
    titlise(`Atlas Selfbot | Version ${version}`)
    console.log(boxen(chalk.blueBright(`╦═══════════════════════════════════════════════════════════════\n╠ Atlas Selfbot ${version} \n╠ Actuellement connecté en tant que ${client.user.tag};${client.user.id}\n╠ Prefix : ${prefix}\n╠ Version : ${version}\n╠ Serveurs : ${client.guilds.size}\n╩═══════════════════════════════════════════════════════════════`), {padding: 1, margin: 1, borderStyle: 'double'}))
    if (firstime === true) console.log(chalk.green(`C'est la première fois que vous utilisez le Selfbot.\nUn dossier de configuration a été créer au chemin suivant :\n${appdata_path}\\Atlas Selfbot\\\n`))
    if (adblock === true) console.log(chalk.green("\nL'Adblock du selfbot est activé. Il bloqueras toutes les pubmp venant de bots. Pour le désactiver, /adblock off."))
    
    
})

client.multistream = []
client.afk = new Map()
client.on("message", async message => {
    if (adblock === true) {
    if (/*message.author.bot && */message.channel.type === "dm") {
        const authorised = ["159985870458322944","204255221017214977","523521540952948785","690844272164864001"];
        if(!authorised.includes(message.author.id)) {
            if(message.content.includes("discord.gg") ||message.content.includes("discordapp.com/invite")) {
                await message.author.send(atlas.font("PUB MP | Cet utilisateur a été bloqué."))
                return message.author.block();
            }
        }
    }
}
    if (message.mentions.users) {
        message.mentions.users.forEach(member => {
             if (member.id === client.user.id) {
                 client.afk.forEach(key => {
                    if (key.afk = true) {
                        message.channel.send(atlas.font(`Désolé **${message.author.username}**, mais je suis actuellement AFK pour la raison suivante : ${key.reason}`))
                    }
                 })
             }
        })
            
    }
    client.afk.forEach(key => {
        if (message.author.id === client.user.id) {
            if (message.content.includes(atlas.font(`mais je suis actuellement AFK pour la raison suivante : ${key.reason}`)) || message.content.includes(`${prefix}afk`) || message.content.includes(atlas.font(`Vous êtes déja AFK.`))) return;
            if (key.afk = true) {
                client.afk.delete('AFK')
                message.channel.send(atlas.font("Vous n'êtes plus AFK."))
            }
        }
    })
    
    if (message.author.id !== client.user.id) return;
    let messageArray = message.content.split(" ");
    let array1 = messageArray[0];
    let args = messageArray.slice(1);
    const pp = client.user.displayAvatarURL
const pseudo = client.user.username
    if (!message.content.startsWith(prefix)) return;
    let command = array1.slice(prefix.length)
    if (command === "help") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        
        let embd = new selfbot.RichEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        
        .setTitle(atlas.font("Commandes de Atlas"))
        .setImage(atlas.rdm_img)
        .setColor(color)
        .addField(`${prefix}help`, atlas.font("Affiche ce menu"))
        .addField(`${prefix}presence`, atlas.font("Affiche les commandes de presences"))
        .addField(`${prefix}utile`, atlas.font("Affiche les commandes utiles"))
        .addField(`${prefix}fun`, atlas.font("Affiche les commandes fun"))
        .addField(`${prefix}config`, atlas.font("Affiche les commandes de configuration"))
        .addField(`${prefix}credits`, atlas.font("Affiche les credits du  SelfBot"))
        message.edit(embd).catch()
    }
    if (command === "credit" || command === "credits") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let embd = new selfbot.RichEmbed()
        .setAuthor(pseudo, pp)
        .setColor(color) 
        .setTitle(atlas.font("Credits"))  
        .setDescription(atlas.font("Atlas Selfbot | Par **HK** | [AtlasSelfbot.xyz](http://atlaselfbot.xyz)"))
        .addField(atlas.font("Console"), "**Couleurs :** [Chalk](https://www.npmjs.com/package/chalk)\n**Box :** [Boxen](https://www.npmjs.com/package/boxen)")
        .addField(atlas.font("Général"), "**API Discord :** [Selfbot.js](https://www.npmjs.com/package/selfbot.js) Version modifiée de Discord.js pour mieux gérer les selfbots\n")
        .addField(atlas.font("Commandes"), "**Requetes HTTPS|HTTP :** [Node-Fetch](https://www.npmjs.com/package/node-fetch)\n**Commande RetroText :** [RetroText](https://www.npmjs.com/package/retrotext) | Modifié par [JeanOuina](https://www.npmjs.com/~jeanouina)\n**Commande System :** [Os](https://www.npmjs.com/os)")
        .addField(atlas.font("Remerciements"), "Merci à **JeanOuina** pour l'aide apporté a certains endroit du selfbot.")
        .setImage(atlas.rdm_img)
        message.edit(embd)

}
    if (command === "utile" || command === "util") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let embd = new selfbot.RichEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor(color)
        .setTitle(atlas.font("Commandes utiles"))
        .setImage(atlas.rdm_img)
        .addField(`${prefix}infos`, atlas.font("Donnes des informations sur le selfbot"))
        .addField(`${prefix}system`, atlas.font("Donnes des informations sur le système d'hébérgement du selfbot"))
        .addField(`${prefix}token`, atlas.font("Donne le début du token de quelqu'un"))
        .addField(`${prefix}backup {create|list|remove|load}`, atlas.font("Commandes de backups"))
        .addField(`${prefix}si | servinfo {id}`, atlas.font("Informations d'un serveur"))
        .addField(`${prefix}ping`, atlas.font("Pong :zoom:"))
        .addField(`${prefix}exit | shutdown`, atlas.font("Eteint le SelfBot."))
        .addField(`${prefix}afk`, atlas.font("Vous met AFK. Le SelfBot répondras a toutes vos mentions."))
        .addField(`${prefix}poll`, atlas.font("Fait un sondage simple"))
        .addField(`${prefix}font`, atlas.font("Change votre texte avec la police du SelfBot"))
        .addField(`${prefix}embed`, atlas.font("Met votre texte dans un embed simple."))
        .addField(`${prefix}pp {mention|id}`, atlas.font("Donne la pp d'un utilisateur"))
        .addField(`${prefix}setpp {mention|id}`, atlas.font("Vole la pp d'un utilisateur :iss:"))
        message.edit(embd).catch()
    }
    if (command === "font" || command === "style") {
        message.edit(atlas.font(args.join(" ")))
    }
    if (command === "infos" || command === "info") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        if (client.user.premium) {
            var nitro = "Oui"
        } else var nitro = "Non"
       if (!client.user.presence.game) {
           var statut = "Aucune"
       }
       
       if (client.user.presence.game) {
        if (client.user.presence.game.type === 0) {
                 var statut = "Joue à " + client.user.presence.game.name
                 if (!client.user.presence.game.name) {
                    var statut = "Aucune"
                }
        }
         if (client.user.presence.game.type === 1) var statut = "Streame " + client.user.presence.game.name
         if (client.user.presence.game.type === 2) {
             var statut = "Écoute " + client.user.presence.game.name 
             if (client.user.presence.game.name === "Spotify") {
                 var statut = "Écoute " + client.user.presence.game.details
             }
         } else if (client.user.presence.game.type === 3) var statut = "Regarde " + client.user.presence.game.name 
        }
        
       let embed = new selfbot.RichEmbed()
       .setColor(color)
       .setTitle(atlas.font("Informations"))
       .addField(atlas.font("Utilisateur :"), `**${client.user.tag}**: \n**Nitro**: ${nitro}\n**Presence**: ${statut}`)
       .addField(atlas.font("Selfbot:"), `**Prefix**: ${prefix} \n **Version**: ${version}`)
       .addField(atlas.font("Développeur:"), `HK`)
       .setThumbnail(client.user.avatarURL)
       .setImage(atlas.rdm_img)
       message.edit(embed).catch()
    }
    if (command === "presence") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let embd = new selfbot.RichEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor(color)
        .setTitle(atlas.font("Commandes de presences"))
        .setImage(atlas.rdm_img)
        .addField(`${prefix}stream`, atlas.font('Votre texte avec "Stream"'))
        .addField(`${prefix}play`, atlas.font('Votre texte avec "Joue à"'))
        .addField(`${prefix}listen`, atlas.font('Votre texte avec "Écoute"'))
        .addField(`${prefix}watch`, atlas.font('Votre texte avec "Regarde"'))
        .addField(`${prefix}default`, atlas.font('La presence de base de Atlas'))
        .addField(`${prefix}multistream [add|remove|see|clear]`, atlas.font("Permet de gérer le multistream."))
        .addField(`${prefix}rpc`, atlas.font('Votre texte avec une richpresence Atlas'))
        .addField(`${prefix}spotify`, atlas.font('Votre texte avec une richpresence Spotify'))
        .addField(`${prefix}lol`, atlas.font('Vous donne la RPC League Of Legend'))
        .addField(`${prefix}fortnite`, atlas.font('Vous donne la RPC Fortnite'))
        .addField(`${prefix}presenceoff`, atlas.font("Désactive votre presence actuelle."))
        message.edit(embd).catch()
    }
    if (command === "stream") {
        
        let stream = args.join(" ")
        if (!stream) return message.edit(atlas.font("Vous devez indiquez un message a stream"))
        client.user.setActivity(`${stream}`, {url: `https://www.twitch.tv/${twitch}`, type : "STREAMING"})
        message.edit(atlas.font("Activité mise a jour"))
    }
    if (command === "play") {
        let stream = args.join(" ")
        if (!stream) return message.edit(atlas.font("Vous devez indiquez un message pour votre presence"))
        client.user.setActivity(`${stream}`)
        message.edit(atlas.font("Activité mise a jour"))
    }
    if (command === "listen") {
        let stream = args.join(" ")
        if (!stream) return message.edit(atlas.font("Vous devez indiquez un message à écouter"))
        client.user.setActivity(`${stream}`, {type : "LISTENING"})
        message.edit(atlas.font("Activité mise a jour"))
    }
    if (command === "watch") {
        let stream = args.join(" ")
        if (!stream) return message.edit(atlas.font("Vous devez indiquez un message à regarder"))
        client.user.setActivity(`${stream}`, {type : "WATCHING"})
        message.edit(atlas.font("Activité mise a jour"))
    }
    if (command === "default") {
        rpcGenerator.getRpcImage("672136533494595624", "atlasselfbot")
        .then(async image => {
            let presence = new rpcGenerator.Rpc()
            .setName(`Atlas Selfbot | Version ${version}`)
            .setUrl(`https://twitch.tv/${twitch}`)
            .setType("STREAMING")
            .setAssetsLargeImage(image.id)
            .setAssetsLargeText(`Version ${version}`)
            .setApplicationId("672136533494595624")
            .setDetails("Atlas")
            await client.user.setPresence(presence.toDiscord())
            message.edit(atlas.font("Activité mise a jour"))
        })
    }
    if (command === "presenceoff") {
        let jeu;

        client.user.setPresence({game: {name: jeu}})
        message.edit(atlas.font("Activité mise a jour"))
    }
    if (command === "rpc") {
        let text = args.join(" ")
        if (!text) return message.edit(atlas.font("Veuillez indiquez un message a appliquer sur la RPC"))
        rpcGenerator.getRpcImage("672136533494595624", "atlasselfbot")
        .then(async image => {
            let presence = new rpcGenerator.Rpc()
            .setName(`Atlas Selfbot | Version ${version}`)
            .setUrl(`https://twitch.tv/${twitch}`)
            .setType("STREAMING")
            .setAssetsLargeImage(image.id)
            .setAssetsLargeText(`Version ${version}`)
            .setApplicationId("672136533494595624")
            .setDetails(text)
            await client.user.setPresence(presence.toDiscord())
            message.edit(atlas.font("Activité mise a jour"))})
                                  
    }
    if (command === "spotify") {
    let text = args.join(" ")
    if (!text) return message.edit(atlas.font("Veuillez indiquez un texte a integrer dans la rpc spotify."))
    let starttp = Date.now()
    client.user.setPresence({since:0,game:{type:2,timestamps:{end:starttp + 83808000, start:starttp},sync_id:"6l7PqWKsgm4NLomOE7Veou",state:`Version ${version}`,session_id:!0,party:{id:"spotify:"+client.user.id},name:"Spotify",id:"spotify:1",flags:48,details:text,created_at:1561389854174,assets:{large_image:"spotify:e8da44efa175c64eb9c8970a9bef5eb4d334bb2a"},secrets:{join:"025ed05c71f639de8bfaa0d679d7c94b2fdce12f",spectate:"e7eb30d2ee025ed05c71ea495f770b76454ee4e0",match:"4b2fdce12f639de8bfa7e3591b71a0d679d7c93f"}},afk:!1})
    message.edit(atlas.font("Activité mise a jour"))

    }
    
    if (command === "lol") {
        rpcGenerator.getRpcImage("673508150544039949", "lol")
        .then(async image => {
            let presence = new rpcGenerator.Rpc()
            .setName("League of Legend")
            .setUrl(`https://twitch.tv/${twitch}`)
            .setType("PLAYING")
            .setAssetsLargeImage(image.id)
            .setApplicationId("673508150544039949")
            .setDetails("Faille de l'invocateur (classé)")
            .setState("Dans un salon")
            await client.user.setPresence(presence.toDiscord())
            message.edit(atlas.font("Activité mise a jour"))
        })
    }
    if (command === "fortnite") {
        let date =Date.now()
        let t = uuid()
        client.user.setPresence({since:0,
            game:{type:0,
                state:"En section",
                session_id:!0,
                party:{size:[1,4],id:t},
                name:"Fortnite",
                id:"f6a0bda70bcef77c",
                flags:2,
                details:"Battle Royale - Dans le salon",
                created_at:date,assets:
                {small_text:"Palier 100",
                small_image:"443127519386927104",
                large_image:"443127594037018634"},
                application_id:"432980957394370572",
                timestamps:{start:null},
                secrets:{join:"025ed05c71f639de8bfaa0d679d7c94b2fdce12f",
                spectate:"e7eb30d2ee025ed05c71ea495f770b76454ee4e0",
                match:"4b2fdce12f639de8bfa7e3591b71a0d679d7c93f"}}})
        message.edit(atlas.font("Activité mise a jour."))
    }
    if (command === "system") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        if (os.platform() === "win32") {
            var osname = "Windows"
        } else
        if (os.platform() === "darwin") {
            var osname = "Mac"
        } else 
        if (os.platform() === "android") {
            var osname = "Android"
        } else if (os.platform() === "linux") {
            var osname = "Linux"
        } else {
            var osname = os.platform()
        }
        
        
        let embed1 = new selfbot.RichEmbed()
        .setColor(color)
        .setTitle(atlas.font("Informations du système"))
        .addField(atlas.font("RAM"), `${Math.round(Math.round(process.memoryUsage().heapUsed/1024/1024*100)/100)/1e3}GB/${Math.round(Math.round(os.totalmem()/1024/1024*100)/100)/1e3}GB`)
        .addField(atlas.font("CPU"), `${os.cpus()[0].model}`)
        .addField(atlas.font("OS"), osname)
        .setAuthor(client.user.username, client.user.displayAvatarURL)

        message.edit(embed1).catch()
    }
    if (command === "token") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        var member = message.mentions.users.first()
        if (!member) return message.edit(atlas.font("Veuillez mentionner un utilisateur."))
        let token1 = atlas.gentoken(member.id)
        let embed1 = new selfbot.RichEmbed()
        .setColor(color)
        .setTitle(atlas.font("Token de ") + member.tag)
        .setDescription(token1)
        .setAuthor(client.user.username, client.user.displayAvatarURL)

        message.edit(embed1).catch()
    }
    if (command === "fun") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let embd = new selfbot.RichEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor(color)
        .setTitle(atlas.font("Commandes funs"))
        .setImage(atlas.rdm_img)
        .addField(`${prefix}retrotext`, atlas.font("Transforme votre text en retro !"))
        .addField(`${prefix}react {id du message} {text}`, atlas.font("menfou"))
        .addField(`${prefix}oafu`, atlas.font("oafued"))
        .addField(`${prefix}ventoline`, atlas.font("j'ai du mal a respirer"))
        .addField(`${prefix}tweet {utilisateur} {texte}`, atlas.font("internet n'oublie pas"))
        .addField(`${prefix}iphonex @mention`, atlas.font("Fils de riche :rage:"))
        .addField(`${prefix}gift`, atlas.font("Nitro gratuit , quelle chance !"))
        .addField(`${prefix}gp`, atlas.font("Supprime instantanément un message :winkwink:"))
        .addField(`${prefix}8ball`, atlas.font("Question Réponse"))
        message.edit(embd).catch()
    }
    if (command === "retro" || command === "retrotext") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        if(!args[0])return message.edit(atlas.font(`Veuillez indiquer un texte a transformer en retro. Syntaxe :`) + `\n ${prefix}retro Atlas \n SelfBot \n V.01`);
        let e= args.join(" ").split(/\n/g);
        if(e.length>3) return message.edit(atlas.font("Erreur ! Vous avez ajouter trop de lignes ! Il n'en faut que 3"));
        e[1]||(e[1]=""),e[2]||(e[2]="");
        let r= new retroText(e);
        r.fetchURL().then(e=>{let t=(new selfbot.RichEmbed).setColor(color).setAuthor(client.user.username,client.user.displayAvatarURL).setTitle(atlas.font("Retrotext")).setImage(e);message.edit(t)}).catch(e=>message.edit("Erreur: "+e))

    }
    if (command === "ping") {
        let date1 = Date.now()
        message.edit(atlas.font("Ping en cours..."))
        .then(t => {
            let date2 = Date.now()
            t.edit(atlas.font(`Ping : \nHTTPS: ${Math.round(date2-date1)} ms \nWebSocket: ${client.ping} ms`))})
    }
    if (command === "react") {
        let msgs = args[0]
        let reacted = args[1]
        let hlpembd = 
        "Mots compatibles : palu menfou"
        if (!msgs) return message.edit(atlas.font("Veuillez indiquer l'id d'un message"))
        if (msgs === "help") return message.edit(atlas.font(hlpembd))
        if (isNaN(msgs)) return message.edit(atlas.font("Veuillez indiquer l'id d'un message"))
        
        if (!reacted) return message.edit(atlas.font("Veuillez indiquer un texte a react"))
        if(reacted === "palu") {
            message.channel.fetchMessage(msgs)
            .then(async t => {
                setTimeout(() => {
                    t.react("🇵")
                    setTimeout(() => {
                        t.react("🇦")
                        setTimeout(() => {
                            t.react("🇱")
                            setTimeout(() => {
                                t.react("🇺")
                            }, 1000); 
                        }, 1000); 
                    }, 1000); 
                }, 1000); 
                
                
                
                message.edit(atlas.font(`Réaction ajoutée avec le texte suivant : **palu**`))
            }).catch(e => {
                message.edit(atlas.font("Une erreur est survenue. L'id du message est surement incorrecte."))
            })
        } else if(reacted === "menfou") {
            message.channel.fetchMessage(msgs)
            .then(async t => {
                setTimeout(() => {
                    t.react("🇲")
                    setTimeout(() => {
                        t.react("🇪")
                        setTimeout(() => {
                            t.react("🇳")
                            setTimeout(() => {
                                t.react("🇫")
                                setTimeout(() => {
                                    t.react("🇴")
                                    setTimeout(() => {
                                        t.react("🇺")
                                    }, 1000); 
                                }, 1000); 
                            }, 1000); 
                        }, 1000); 
                    }, 1000); 
                }, 1000); 

                message.edit(atlas.font(`Réaction ajoutée avec le texte suivant : **menfou**`))
            }).catch(e => {
                message.edit(atlas.font("Une erreur est survenue. L'id du message est surement incorrecte."))
            })
        } else return message.edit(atlas.font("Le mot que vous avez entré est incorrect. Faites " + prefix + "react help pour avoir une liste complète des mots utilisables."))
        
    }
    if (command === "si" || command === "servinfo") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let id = args[0]
        
        if (!id) {
            if (!message.guild) return message.edit(atlas.font("Veuillez indiquer l'identifiant d'un serveur"))
            var guilda = message.guild
        }
       
        if (id) {
            if (isNaN(id)) return message.edit(atlas.font("Veuillez indiquer l'identifiant d'un serveur"))
            var guilda = client.guilds.get(id)
        }
        
        try {
            guilda.owner.user.tag
        } catch (error) {
            var owner = "Inconnu"
            var hehe = "Let !"
        }
         
        if (!hehe) {
            var owner = guilda.owner.user.tag
        }
        let embd1 = new selfbot.RichEmbed()
        .setColor(color)
        try {
            embd1.setTitle(atlas.font("Informations | ") + guilda.name)
        } catch (error) {
            return message.edit(atlas.font("Veuillez indiquer l'identifiant d'un serveur."))
        }
        if (guilda.features.length <= 0) {
            var fit = "Aucune"
            var lvl = "Pas de niveau de boost"
        }
        if (guilda.features.length >= 1) {
            var fit = ""
            if (guilda.features.includes("INVITE_SPLASH")) {
                fit = fit + "Fond d'écran d'invitation\n"
            }
            if (guilda.features.includes("ANIMATED_ICON")) {
                fit = fit + "Icone animée\n"
                var lvl = "Boost niveau 1"
            }
            if (guilda.features.includes("BANNER")) {
                fit = fit + "Bannière de serveur\n"
                var lvl = "Boost niveau 2"
            }
            if (guilda.features.includes("VANITY_URL")) {
                fit = fit + "URL d'invitation personalisée\n"
                var lvl = "Boost niveau 3"
            }
            if (guilda.features.includes("FEATURABLE")) {
                fit = fit + "Mis en avant depuis la page d'accueille\n"
            }
            if (guilda.features.includes("PUBLIC")) {
                fit = fit + "Public\n"
            }
            if (guilda.features.includes("DISCOVERABLE")) {
                fit = fit + "Découverable depuis la page d'accueille\n"
            }
            if (guilda.features.includes("VIP_REGIONS")) {
                fit = fit + "384kbps bitrate en vocal\n"
            }
            if (guilda.features.includes("VERIFIED")) {
                fit = fit + "Vérifié par discord\n"
            }
            if (guilda.features.includes("NEWS")) {
                fit = fit + "Possède des salons suivables\n"
            }
            if (guilda.features.includes("COMMERCE")) {
                fit = fit + "Peut vendre des choses légalement \n"
            }
        }
            embd1
        .setTitle(atlas.font("Informations | ") + guilda.name)
        .setDescription(atlas.font(`Le serveur ${guilda.name} comporte ${guilda.memberCount} utilisateurs`))
        .addField(atlas.font("ID"), guilda.id)
        .addField(atlas.font("Owner"), owner)
        .addField(atlas.font("Créer le"), timedate(guilda.createdTimestamp, 'dd/MM/yyyy à HH:mm:ss'))
        .addField(atlas.font("Caractéristiques"), `**${lvl}**\n ${fit}`)
        .setThumbnail(guilda.iconURL)
        message.edit(embd1)
            
    } 
    if (command === "ui" || command === "userinfo") {
       let member = message.mentions.users.first() || client.users.get(args[0])
       if (!member) return message.edit(atlas.font("Veuillez mentionner un utilisateur ou indiquer un ID."))

    }
    if (command === "oafu") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let oafu = ["https://cdn.discordapp.com/attachments/664286025941516307/670010340033036318/Sans_titre.png",
                    "https://cdn.discordapp.com/attachments/665658045547937802/665909106317590548/page_8.png",
                    "https://cdn.discordapp.com/attachments/630452596745961492/657349416600076318/SDFE.png",
                    "https://cdn.discordapp.com/attachments/662715238700941332/663555244961300511/page_7.png",
                    "https://cdn.discordapp.com/attachments/662715238700941332/664207383446290439/page_13.png",
                    "https://cdn.discordapp.com/attachments/662715238700941332/665659276479692810/page_29.png",
                    "https://cdn.discordapp.com/attachments/662715238700941332/667839679227232276/page_46.png",
                    "https://cdn.discordapp.com/attachments/662715238700941332/670316444055109642/Sans_titre.png",
                    "https://cdn.discordapp.com/attachments/665657784691458092/671040909579911192/Sans_titre.png",
                    "https://cdn.discordapp.com/attachments/665657784691458092/673537052758769685/SFEFSEG.png",
                    "https://cdn.discordapp.com/attachments/665657784691458092/675799454271406080/zqfqzfzqf.png",
                    "https://cdn.discordapp.com/attachments/665657784691458092/675862463966740511/SDFSEGE.png"]
        let embd1 = new selfbot.RichEmbed()
        .setColor(color)
        .setAuthor(pseudo, pp)
        .setTitle(atlas.font("Iriku No Soul | Clique ici"))
        .setImage(oafu[Math.floor(Math.random() * oafu.length)])
        .setURL("https://discord.gg/bvycMB4")
        message.edit(embd1).catch()
    }
    if (command === "ventoline" || command === "vento"){
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let vento = ["https://lh3.googleusercontent.com/proxy/LyG7bIlm7oCCdyNfIyNI30AOmqcTdQnHojPxIY-c7Jame7It5_z6xkagdz8JEetaaaQ-PGXi4MnQYXbl8jOYLEDS1zOuxVHS9Ry3",
                     "https://www.sciencesetavenir.fr/assets/img/2017/09/15/cover-r4x3w1000-59bbc9c7208e4-049-f0193235.jpg",
                     "https://www.levif.be/medias/4053/2075297.jpg",
                     "https://media.discordapp.net/attachments/551475178870407173/559292194108997652/D0WnMx8WkAAp_SR.png?width=304&height=301"]

        let embd1 = new selfbot.RichEmbed()
            .setColor(color)
            .setAuthor(pseudo, pp)
            .setTitle(atlas.font("ARGH"))
            .setDescription("J'ai du mal a respirer , il fait chaud non ?")
            .setImage(vento[Math.floor(Math.random() * vento.length)])
        message.edit(embd1).catch()
    }
    if (command === "tweet" || command === "twitter") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let user = args[0]
        if (!user) return message.edit(atlas.font("Veuillez entrer un nom d'utilisateur."))
        let msg = args.splice(1, args.length).join(' ');
        if (!msg) return message.edit(atlas.font("Veuillez entrer un message."))
        neko.tweet(user,msg).then(e => {
            e.json().then(e => {
                let embd1 = new selfbot.RichEmbed()
        .setColor(color)
        .setImage(e.message)
        .setTitle(atlas.font("Twitted"))
        .setAuthor(pseudo,pp)
        message.edit(embd1)
            })
        })
       
        
    }
    if (command === "iphonex" || command === "iphone") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
       let member = message.mentions.users.first()
       if (!member) return message.edit(atlas.font("Veuillez mentionner un utilisateur."))
       neko.iphone(member.displayAvatarURL)
       .then(e => {
           e.json()
           .then(e => {
               let embd1 = new selfbot.RichEmbed()
               .setTitle(atlas.font("Iphoned"))
               .setImage(e.message)
               .setColor(color)
               .setAuthor(pseudo, pp)
               message.edit(embd1)
           })
       })
    }
    if (command === "config") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let embd = new selfbot.RichEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL)
        .setColor(color)
        .setTitle(atlas.font("Commandes de configurations"))
        .setImage(atlas.rdm_img)
        .addField(`${prefix}safemod {on|off}`, atlas.font("Gère le Safemod des embeds"))
        .addField(`${prefix}setcolor`, atlas.font("Change la couleur des embeds"))
        .addField(`${prefix}setfont {on|off}`, atlas.font("Active ou désactive la police du Selfbot"))
        .addField(`${prefix}twitch`, atlas.font("Change le twitch pour les présences de stream"))
        .addField(`${prefix}adblock {on|off}`, atlas.font("Active ou désactive le bloqueur de PubMP"))
        message.edit(embd).catch()
    }
    if (command === "safemod") {
        let method = args[0]
        if (method === "on") {
            jsonconf.safemod = true
            fs.writeFileSync(`${appdata_path}/Atlas Selfbot/config.json`, beautify(JSON.stringify(jsonconf), {format: 'json'}), function writeJSON(err) {
                if (err) return console.log(err);
              });
            message.edit(atlas.font("Le mode Safe a été activé. Relancez le selfbot pour sauvegarder les changements"))
              
        } else if (method === "off") {
            jsonconf.safemod = false
            fs.writeFileSync(`${appdata_path}/Atlas Selfbot/config.json`, beautify(JSON.stringify(jsonconf), {format: 'json'}), function writeJSON(err) {
                if (err) return console.log(err);
              });
            message.edit(atlas.font("Le mode Safe a été désactivé. Relancez le selfbot pour sauvegarder les changements"))
        } else return message.edit(atlas.font("Désolé, méthode non reconnue. Les méthodes autorisés sont [ON|OFF]"))
    }
    if (command === "adblock") {
        let method = args[0]
        if (method === "on") {
            jsonconf.adblock = true
            fs.writeFileSync(`${appdata_path}/Atlas Selfbot/config.json`, beautify(JSON.stringify(jsonconf), {format: 'json'}), function writeJSON(err) {
                if (err) return console.log(err);
              });
            message.edit(atlas.font("L'Adblock a été activé. Relancez le selfbot pour sauvegarder les changements"))
              
        } else if (method === "off") {
            jsonconf.adblock = false
            fs.writeFileSync(`${appdata_path}/Atlas Selfbot/config.json`, beautify(JSON.stringify(jsonconf), {format: 'json'}), function writeJSON(err) {
                if (err) return console.log(err);
              });
            message.edit(atlas.font("L'Adblock a été désactivé. Relancez le selfbot pour sauvegarder les changements"))
        } else return message.edit(atlas.font("Désolé, méthode non reconnue. Les méthodes autorisés sont [ON|OFF]"))
    }
    if (command === "twitch") {
        let name = args[0]
        
            jsonconf.twitch = name
            fs.writeFileSync(`${appdata_path}/Atlas Selfbot/config.json`, beautify(JSON.stringify(jsonconf), {format: 'json'}), function writeJSON(err) {
                if (err) return console.log(err);
              });
            message.edit(atlas.font(`Votre pseudo twitch est maintenant ${name}. Relancez le selfbot pour sauvegarder les modifications.`))
              
    }
    if (command === "setcolor") {
        let color1 = args[0].replace("#", "")
        var re = /([\dA-Fa-f]{6}|[\dA-Fa-f]{3}|RANDOM|DEFAULT|WHITE|AQUA|GREEN|BLUE|PURPLE|LUMINOUS_VIVID_PINK|GOLD|ORANGE|RED|GREY|DARKER_GREY|NAVY|DARK_AQUA|DARK_GREEN|DARK_BLUE|DARK_PURPLE|DARK_VIVID_PINK|DARK_GOLD|DARK_ORANGE|DARK_RED|DARK_GREY|LIGHT_GREY|DARK_NAVY)/

        let match = color1.match(re)
        if(!match)return message.edit(atlas.font("Désolé , mais cette couleur est incorrecte."))
        if(match[0].length !== color1.length)return message.edit(atlas.font("Désolé , mais cette couleur est incorrecte."))
        jsonconf.color = color1
        fs.writeFileSync(`${appdata_path}/Atlas Selfbot/config.json`, beautify(JSON.stringify(jsonconf), {format: 'json'}), function writeJSON(err) {
            if (err) return console.log(err);
          });
        message.edit(atlas.font(`La nouvelle couleur est maintenant ${color1}. Redémarrez le selfbot pour mettre a jour l'information.`))
        


    }
    if (command === "gift") {
        message.edit("> **Nitro généré. Si le nitro est déja utilisé , réessayez.**\n\nhttps://discordapp.com/store/skus/521847234246082599/")
    }
    if (command === "shutdown" || command === "exit") {
        await message.edit(atlas.font("Arrêt du selfbot..."))
        console.log(conserr("Arrêt du SelfBot a distance...")) 
        process.exit()
    }
    if (command === "multistream") {
        let method = args[0]
        if(!method) return message.edit(atlas.font("Veuillez indiquer une methode [add|remove|clear|see]"))
        if (method === "add") {
            let msg = args.splice(1, args.length).join(" ")
            if (!msg) return message.edit(atlas.font("Veuillez indiquer un message a ajouter au multistream actuel."))
            if (client.multistream.length >= 5) return message.edit(atlas.font("Vous avez atteint le nombre maximum de multistream (5)"))
            if (client.multistream.indexOf(msg) >= 0) return message.edit(atlas.font(`Le texte ${msg} est déja présent dans le multistream`))
            client.multistream.push(msg)
            message.edit(atlas.font(`Le texte "${msg}" à été ajouté au multistream avec l'ID ${client.multistream.indexOf(msg)}`))
            
        var mls = setInterval(() => {
            client.multistream.forEach(msgs => {
                setTimeout(()=> {client.user.setActivity(`${msgs}`, {url: `https://www.twitch.tv/${twitch}`, type : "STREAMING"})
                }, 2000);
                });
        }, 2000 * client.multistream.length)

        } else if (method === "remove") {
            let id = args[1]
            if (!id) return message.edit(atlas.font("Veuillez indiquer l'ID d'un multistream a retirer"))
            if (isNaN(id)) return message.edit(atlas.font("Veuillez indiquer l'ID d'un multistream a retirer"))
            if (!client.multistream[id]) return message.edit(atlas.font("Cet ID n'est pas présent dans le multistream actuel."))
            client.multistream.splice(id, 1)
            message.edit(atlas.font(`Le multistream avec l'ID ${id} a été retiré.`))
            try {
                clearInterval(mls)
            } catch (error) {
                
            }
            var mls = setInterval(() => {
                client.multistream.forEach(msgs => {
                    setTimeout(()=> {client.user.setActivity(`${msgs}`, {url: `https://www.twitch.tv/${twitch}`, type : "STREAMING"})
                    }, 2000);
                    });
            }, 2000 * client.multistream.length)
        } else if (method === "clear") {
            if (client.multistream.length <= 0) return message.edit(atlas.font("Vous n'avez pas de multistream."))
            client.multistream.splice(0, client.multistream.length)
            message.edit(atlas.font("Le multistream a été remis à 0"))
            clearInterval(mls)
            let jeu;

        client.user.setPresence({game: {name: jeu}})
        } else if (method === "see") {
            if (client.multistream.length <= 0) return message.edit(atlas.font("Vous n'avez pas de multistream."))
            let embd = new selfbot.RichEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setColor(color)
            .setTitle(atlas.font("Multistream"))
            client.multistream.forEach(i => {
                embd.addField(`**ID ${client.multistream.indexOf(i)}**`, i)
            });
            message.edit(embd).catch() 

        } else return message.edit(atlas.font("Veuillez indiquer une methode [add|remove|clear|see]"))
    }
    if (command === "afk") {
        let afkj = client.afk.get('AFK')
        if (afkj) return message.edit(atlas.font("Vous êtes déja AFK."))
        let reason = args.join(" ")
            if (!reason) {
            reason = "Je suis AFK. Je vous réponderais le plus rapidement possible !"
        }
        let construct = {
            afk : true,
            reason: reason
        }
        client.afk.set('AFK', construct);
        message.edit(atlas.font(`Vous êtes maintenant AFK pour la raison suivante : ${reason}. Renvoyez un message pour désactiver l'AFK`))
            
        
        
        
    
    }
    if (command === "gp") {
        message.delete()
    }
    if(command === "emote" || command == "emoji") {
        if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        var emoji = client.emojis.find(emoji => emoji.name.toLowerCase().includes(args.slice(0).join("").toLowerCase()))

        if(!emoji) return

        message.edit({embed: {
                    color: '000000',
                    author: {
                    name: "­",
                    icon_url: emoji.url
                },
            }
        })
    }
    if (command === "survey" || command === "poll" || command === "sondage") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let text = args.join(" ")
        if (!text) return message.edit("Veuillez indiquez une question pour votre sondage")
        let reactembd = new selfbot.RichEmbed()
        .setColor(color)
        .setTitle(atlas.font("Sondage"))
        .setAuthor(pseudo, pp)
        .setDescription(text)
        .setFooter("✅ Oui | ❌ Non | 🤷‍♂️ Je ne sais pas")
        await message.edit(reactembd)
        .then(async e => {
            await e.react("✅")
            await e.react("❌")
            setTimeout(async function() {await e.react("🤷‍♂️")},1000);
        })
    }
    if (command === "question" || command === "8ball") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let qst = args.join(" ")
        if (!qst) return message.edit("Veuillez indiquer une question a poser")
        let rps = ["Oui bg", "Non", "Je sais pas sah", "Ptdrrr allez bouge", "C'est une question ça ?",
    "Circulez monsieur", "Je sais pas","jrépondrais pas", "jcrois", "pas sur", "j'pense pas"]
        let réponse = rps[Math.floor(Math.random() * rps.length)]
        let emb1 = new selfbot.RichEmbed()
        .setColor(color)
        .setTitle(atlas.font("8ball"))
        .addField(atlas.font("Question :"), qst)
        .addField(atlas.font("Réponse :"), réponse)
        .setAuthor(pseudo, pp)
        message.edit(emb1)
    }
    if (command === "b64" || command === "base64") {
    let method = args[0]
        let text = args.slice(1, args.length).join(" ")
        if (!method) return message.edit(atlas.font("Vous n'avez pas indiquer de méthode [encode|decode]"))
        if (!text) return message.edit(atlas.font("Vous n'avez pas indiquer de texte"))
        if (method === "encode") {
            try {
                utf8.encode(text)
            } catch (error) {
                message.edit(atlas.font("Votre texte est déja encodé en base64."))
            }
            var bytes = utf8.encode(text);
            var encoded = b64.encode(bytes);
            message.edit(encoded)

        } 
        if (method === "decode") {
            try {
                utf8.decode(b64.decode(text))
            } catch (error) {
                message.edit(atlas.font("Votre texte n'est pas encodé en base64."))
            }
            var bytes = b64.decode(text);
            var decoded = utf8.decode(bytes);
            message.edit(decoded)

        }
    }
    if (command === "embed") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let text = args.join(" ")
        if (text.length > 256) return message.edit(atlas.font("Le texte ne dois pas excéder 256 caractères."))
        if (!text) return message.edit(atlas.font("Veuillez indiquer un texte a mettre dans l'embed"))
        let embd1 = new selfbot.RichEmbed()
        .setColor(color)
        .setTitle(text)
        .setAuthor(pseudo, pp)
        message.edit(embd1)
    }
    if (command === "pp") {
        if (message.guild) {
            if (!message.channel.permissionsFor(message.member).has("EMBED_LINKS")) return;
        }
        let user = message.mentions.users.first() || client.users.get(args[0])
        if (!user) return message.edit(atlas.font("Veuillez mentionner un utilisateur ou indiquer un ID."))
        let embd = new selfbot.RichEmbed()
        .setColor(color)
        .setTitle(atlas.font("PP de") + ` ${message.author.username}`)
        .setImage(user.displayAvatarURL)
        .setAuthor(pseudo,pp)
        message.edit(embd)
    }
    if (command === "backup") {
        
        let backupfolder = `${appdata_path}/Atlas Selfbot/backups/`
        let method = args[0]
        if (method === "create") {
            if (!message.guild) return message.edit(atlas.font("Les commandes de backups sont utilisable que dans des serveurs."))
            message.edit(atlas.font("Veuillez patienter..."))
            backup.create(message.guild).then(e => {
                
                message.edit(atlas.font(`Backup crée avec l'ID `) + e)
            })
           
            

            
        }
        if (method === "list") {
            let embd = new selfbot.RichEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setColor(color)
            .setTitle(atlas.font("Backups"))
            fs.readdirSync(`${appdata_path}/Atlas Selfbot/backups`).forEach(e => {
                
                let backupinfo = JSON.parse(fs.readFileSync(`${appdata_path}/Atlas Selfbot/backups/${e}`))
                var date = timedate(backupinfo.createdTimestamp, 'dd/MM/yyyy à HH:mm:ss')
                embd.addField(`${prefix}backup load ${backupinfo.backupID}`, atlas.font(`Backup de `) + backupinfo.name + atlas.font(`\nCréer le ${date}`))
            })
            message.edit(embd)
        }
        if (method === "load") {
            if (!message.guild) return message.edit(atlas.font("Les commandes de backups sont utilisable que dans des serveurs."))
            let idback = args[1]
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.edit(atlas.font("Vous n'avez pas la permission requise."))
            if (!fs.existsSync(`${appdata_path}/Atlas Selfbot/backups/${idback}.json`)) return message.edit(atlas.font("Cette backup n'existe pas"))
            backup.load(idback, message.guild)
        }
        if (method === "info") {
            let idback = args[1]
            if (!fs.existsSync(`${appdata_path}/Atlas Selfbot/backups/${idback}.json`)) return message.edit(atlas.font("Cette backup n'existe pas"))
            backup.getBackupInformations(idback).then(e => {
                let embd1 = new selfbot.RichEmbed()
                .setColor(color)
                .setTitle(atlas.font("Backup | ") + e.name)
                .addField(atlas.font("ID"), e.guildID)
                .addField(atlas.font("Owner"), e.owner)
                .addField(atlas.font("Backup crée le"), timedate(e.createdTimestamp, 'dd/MM/yyyy à HH:mm:ss'))
                .addField(atlas.font("Caractéristiques"), `**${e.level}**\n ${e.features}`)
                .setThumbnail(e.icon)
             message.edit(embd1)
            })
            
        }
    }
        
})

        


