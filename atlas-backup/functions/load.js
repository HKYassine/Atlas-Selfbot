const utils = require("./utils");
const collection = require("@discordjs/collection")
const createdroles = new collection()
/**
     * Restore guild configuration
     * @param {object} guild The discord guild
     * @param {object} conf The configuration
     */
async function configuration(guild, conf){
        guild.setName(conf.name);
        guild.setIcon(conf.icon);
        guild.setRegion(conf.region);
        guild.setVerificationLevel(conf.verificationLevel);
        guild.setDefaultMessageNotifications(conf.defaultMessageNotifications);
        guild.setExplicitContentFilter(conf.explicitContentFilter);
        return true;
}
/**
     * Restore guild roles
     * @param {object} guild The discord guild
     * @param {object} conf The configuration
     */
async function roles(guild, conf) {
        await Promise.all(conf.roles.map(async (roleData) =>{
            
            
            let e = await guild.createRole({ // Create the role
                name: roleData.name,
                color: roleData.color,
                hoist: roleData.hoist,
                permissions: roleData.permissions,
                mentionable: roleData.mentionable,
                position: roleData.position
            }).catch(e => null)
        if(!e)return
            createdroles.set(roleData.id, e.id)
        return
        }))
        return true;
}

/**
 * Creates a category for the guild
 * @param {object} categoryData The data of the category to create
 * @param {object} guild The discord guild
 * @returns The category
 */
async function loadCategory(categoryData, guild, conf){
    return new Promise(function(resolve, reject){
        var permOverwrites = [];
        categoryData.permissionOverwrites.forEach(async (perm) => {
                if (perm.roleName === "@everyone") {
                    var role = guild.id
                } else var role = createdroles.find(e => e.id === perm.id)
                if (role) {
                    permOverwrites.push({
                        id: role,
                        allowed: perm.allow,
                        denied: perm.deny
                    })
                }
                
                    
                
            });
        guild.createChannel(categoryData.name, { // Create the category
            type: "category",
            permissionOverwrites: permOverwrites
        }).then(async (category) => { // When the category is created
            
            
            resolve(category); // Return the category
        });
    });
}
/**
 * Create a channel and returns it
 * @param {object} channelData The channel Data
 * @param {object} category The parent category of the channel (optional)
 * @param {object} guild The guild on which the category will be created
 * @returns The channel
 */
async function loadChannel(channelData, category, guild){
    return new Promise(async function(resolve, reject){
        var permOverwrites = [];
        channelData.permissionOverwrites.forEach((perm) => {
            if (perm.roleName === "@everyone") {
                var role = guild.id
            } else var role = createdroles.find(e => e.id === perm.id)
            if(role){
                permOverwrites.push({
                    id: role,
                    allowed: perm.allow,
                    denied: perm.deny
                });
            }
        }); setTimeout(() => {

        })
        if (channelData.type === "text") {
            guild.createChannel(channelData.name, {
                type: "text",
                topic: channelData.topic,
                nsfw: channelData.nsfw,
                parent: category,
                permissionOverwrites: permOverwrites
            }).then(async (channel) => {
                resolve(channel);
            })
        } else
        if (channelData.type === "voice") {
            guild.createChannel(channelData.name, {
                type: "voice",
                bitrate: channelData.bitrate * 1000 || 64000,
                userLimit: channelData.userLimit,
                parent: category,
                permissionOverwrites: permOverwrites
            }).then(async (channel) => {
                resolve(channel);
            })
        }
        
        
        
    });
}

/**
     * Restore guild channels
     * @param {object} guild The discord guild
     * @param {object} conf The configuration
     */
async function channels(guild, conf){
        conf.channels.categories.forEach((category) => {
        loadCategory(category, guild, conf).then((CategoryChannel) => {
            category.children.forEach((channel) => {
                setTimeout(() => {
                    loadChannel(channel, CategoryChannel, guild);
                }, 1000)
            });
        });
    });  
        return true;
}

/**
     * Restore afk configuration
     * @param {object} guild The discord guild
     * @param {object} conf The configuration
     */
    async function afk(guild, conf){
        if(conf.AFK){
            guild.setAfkChannel(guild.channels.find((ch) => ch.name === conf.AFK.name));
            guild.setAfkTimeout(conf.AFK.timeout);
        }
        return true;
    }

    /**
     * Restore guild emojis
     * @param {object} guild The discord guild
     * @param {object} conf The configuration
     */
    async function emojis(guild, conf){
        conf.emojis.forEach((emoji) => {
            guild.createEmoji(emoji.url, emoji.name).catch(() => {})
        });
        return true;
    }

    /**
     * Restore guild bans
     * @param {object} guild The discord guild
     * @param {object} conf The configuration
     */
    async function bans(guild, conf){
        if (!conf.bans) return;
        conf.bans.forEach((ban) => {
            guild.ban(ban.id, {
                reason: ban.reason
            });
        });
        return true;
    }
 
     /**
     * Restore embedChannel configuration
     * @param {object} guild The discord guild
     * @param {object} conf The configuration
     */
    async function embedChannel(guild, conf){
        if(conf.embedChannel){
            guild.setEmbed({
                enabled: conf.embed.enabled,
                channel: guild.channels.find((ch) => ch.name === conf.embed.channel)
            });
        }
        return true;
    }
module.exports = {
    configuration,
    roles,
    createdroles,
    loadCategory,
    channels,
    afk,
    emojis,
    bans,
    embedChannel,
};