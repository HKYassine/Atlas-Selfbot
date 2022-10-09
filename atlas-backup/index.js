/* Pour en savoir plus sur ce module, allez sur : https://npmjs.com/package/discord-backup *
Module modifié par HellastoK pour supporter la V11 de discord.js*/

const util = require("util"),
fs = require("fs"),
readdir = util.promisify(require("fs").readdir),
randomstring = require("randomstring");
const appdata_path = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
if(!fs.existsSync(`${appdata_path}/Atlas Selfbot/backups/`)){
    fs.mkdirSync(`${appdata_path}/Atlas Selfbot/backups`, {recursive: true})
} 
let backups = `${appdata_path}/Atlas Selfbot/backups/`;
const beautify = require("beautify")


const collection = require("@discordjs/collection")
const fBackup = require("./functions/backup"),
fLoad = require("./functions/load"),
utils = require("./functions/utils");

/**
 * Cette fonction vérifie si la backup éxiste et retourne son ID 
 * @param {string} backupID
 * @returns Les informations de la backup
 */
async function getBackupInformations(backupID){
    return new Promise(async function(resolve, reject){
        let files = await readdir(backups); // Lis le dossier "backups"
        // Essaye d'avoir le fichier .json
        let file = files.filter((f) => f.split(".").pop() === "json").find((f) => f === `${backupID}.json`);
        if(file){ // Si le fichier éxiste
            let backupInformations = require(`${backups}${file}`);
            // Retourne les informations de la backup
            resolve(backupInformations);
        } else {
            // Sinon, retourne "Aucune backup trouvée"
            reject("Aucune backup trouvée.");
        }
    });
}

module.exports = {
    getBackupInformations,
    /* Returns la version du module*/
    version: require("./package.json").version,

    /**
     * Change le fichier backups
     * @param {string} path The folder path 
     */
    setStorageFolder(path){
        backups = path;
        if(!fs.existsSync(backups)){
            fs.mkdirSync(backups);
        }
    },

    /**
     * This function fetches a backyp and returns the information about it
     * @param {string} backupID The ID of the backup to fetch
     * @returns An object, the backup informations
     */
    async fetch(backupID){
        return new Promise(async function(resolve, reject){
            getBackupInformations(backupID).then((backupInformations) => {
                let size = fs.statSync(`${backups}${backupID}.json`).size; // Gets the size of the file using fs
                // Returns backup informations
                resolve({
                    ID: backupID,
                    guildID: backupInformations.guildID,
                    createdTimestamp: backupInformations.createdTimestamp,
                    size: `${(size/1024/1024).toFixed(2)}MB`,
                    data: backupInformations
                });
            }).catch((err) => {
                resolve(false);
            });
        });
    },

    /**
     * This function creates a backup for a discord server
     * @param {object} guild The guild to backup
     * @returns The backup ID
     */
    async create(guild){
        return new Promise(async function(resolve, reject){
            let backupID = randomstring.generate(5)
            try {
                guild.owner.user.tag
            } catch (error) {
                var owner = "Inconnu"
                var hehe = "Let !"
            }
            if (guild.features.length <= 0) {
                var fit = "Aucune"
                var lvl = "Pas de niveau de boost"
            }
            if (guild.features.length >= 1) {
                var fit = ""
                if (guild.features.includes("INVITE_SPLASH")) {
                    fit = fit + "Fond d'écran d'invitation\n"
                }
                if (guild.features.includes("ANIMATED_ICON")) {
                    fit = fit + "Icone animée\n"
                    var lvl = "Boost niveau 1"
                }
                if (guild.features.includes("BANNER")) {
                    fit = fit + "Bannière de serveur\n"
                    var lvl = "Boost niveau 2"
                }
                if (guild.features.includes("VANITY_URL")) {
                    fit = fit + "URL d'invitation personalisée\n"
                    var lvl = "Boost niveau 3"
                }
                if (guild.features.includes("FEATURABLE")) {
                    fit = fit + "Mis en avant depuis la page d'accueille\n"
                }
                if (guild.features.includes("PUBLIC")) {
                    fit = fit + "Public\n"
                }
                if (guild.features.includes("DISCOVERABLE")) {
                    fit = fit + "Découverable depuis la page d'accueille\n"
                }
                if (guild.features.includes("VIP_REGIONS")) {
                    fit = fit + "384kbps bitrate en vocal\n"
                }
                if (guild.features.includes("VERIFIED")) {
                    fit = fit + "Vérifié par discord\n"
                }
                if (guild.features.includes("NEWS")) {
                    fit = fit + "Possède des salons suivables\n"
                }
                if (guild.features.includes("COMMERCE")) {
                    fit = fit + "Peut vendre des choses légalement \n"
                }
            }
             
            if (!hehe) {
                var owner = guild.owner.user.tag
            }
            // Check if it's the good version
            let guildData = {
                name: guild.name,
                icon: guild.iconURL,
                region: guild.region,
                verificationLevel: guild.verificationLevel,
                explicitContentFilter: guild.explicitContentFilter,
                defaultMessageNotifications: guild.defaultMessageNotifications,
                owner: owner,
                level: lvl,
                features: fit,
                AFK: (guild.afkChannel ? {
                    name: guild.afkChannel.name,
                    timeout: guild.afkTimeout
                } : false),
                embed:{
                    enabled: guild.embedEnabled,
                    channel: (guild.embedChannel ? guild.embedChannel.name : false)
                },
                splash: guild.splashURL,
                banner: guild.banner,
                channels:{
                    categories:[],
                    others:[]
                },
                bans:[],
                emojis:[],
                createdTimestamp: Date.now(),
                guildID: guild.id,
                backupID: backupID
            };
            let rola = await fBackup.getRoles(guild).catch((err) => {});
            let bans = await fBackup.getBans(guild).catch((err) => {});
            // Backup bans
            guildData.bans = bans
            // Backup roles
            guildData.roles = rola
            // Backup emojis
            guildData.emojis = await fBackup.getEmojis(guild).catch((err) => {});
            // Backup channels
            guildData.channels = await fBackup.getChannels(guild).catch((err) => {});
            // Convert Object to JSON
            let backupJSON = JSON.stringify(guildData);
            // Create backup ID
            // Save the backup
            fs.writeFileSync(`${backups}${guildData.backupID}.json`, beautify(backupJSON, {format: 'json'}));
            // Returns ID
            resolve(backupID);
        });
    },

    /**
     * This function loads a backup for a guild
     * @param {string} backupID The ID of the backup to load
     * @param {object} guild The guild on which the backup will be loaded
     * @returns If the operation is successful
     */
    async load(backupID, guild){
        return new Promise(async function(resolve, reject){
            getBackupInformations(backupID).then(async (backupInformations) => {
                if(!guild){
                    return reject("Invalid guild");
                }
                
                // Clear the guild
                await utils.clearGuild(guild)

                // Restore guild configuration
                await fLoad.configuration(guild, backupInformations);
                // Restore guild roles
                await fLoad.roles(guild, backupInformations);
                // Restore guild channels
                await fLoad.channels(guild, backupInformations);
                // Restore afk channel and timeout
                await fLoad.afk(guild, backupInformations);
                // Restore guild emojis
                await fLoad.emojis(guild, backupInformations);
                // Restore guild bans
                await fLoad.bans(guild, backupInformations);

                // Restore embed channel
                await fLoad.embedChannel(guild, backupInformations);
                // Then return true
                return resolve(true);
            })

        });
    },

    /**
     * This function deletes a backup
     * @param {string} backupID The ID of the backup to delete
     * @returns If the operation is successful
     */
    async delete(backupID){
        let filePath = `${backups}${backupID}.json`;
        try {
            fs.unlinkSync(filePath);
            return true;
        } catch(error){
            return error;
        }
    },

    /**
     * This function returns the list of all backup
     * @returns The list of the backups
     */
    async list(){
        let files = await readdir(backups); // Read "backups" directory
        return files.map((f) => f.substr(0, 5));
    }
};





