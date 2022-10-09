
/**
 * Gets OverwritesPermission for a guild channel
 * @param {object} GuildChannel 
 * @returns The OverwritesPermission
 */
function fetchOverwritesPermission(GuildChannel){
    let permOverwrites = [];
    GuildChannel.permissionOverwrites.filter((p) => p.type === "role").forEach((perm) => { // For each overwrites permission
        let role = GuildChannel.guild.roles.get(perm.id);
        if(role){
            permOverwrites.push({
                roleId: role.id,
                roleName: role.name,
                perm: permOverwrites.perm,
                allow: perm.allow,
                deny: perm.deny
            });
        }
    });
    return permOverwrites;
}

/**
 * This function fetches the channel data that are necessary for the backup
 * @param {object} GuildChannel The discord channel
 * @returns The channel data
 */
async function fetchChannelData(GuildChannel){
    return new Promise(async function(resolve, reject){
        let channelData = {};
        if(GuildChannel.type === "text"){
            /* Get basic informations */
            channelData.type = "text";
            channelData.name = GuildChannel.name;
            channelData.nsfw = GuildChannel.nsfw;
            channelData.id = GuildChannel.id;
            channelData.parent = (GuildChannel.parent ? GuildChannel.parent.name : false);
            channelData.topic = GuildChannel.topic;
            channelData.permissionOverwrites = fetchOverwritesPermission(GuildChannel);
            /* Fetch last 100 channel messages */
            
            resolve(channelData);
        } else if(GuildChannel.type === "voice"){
            /* Get basic informations */
            channelData.type = "voice";
            channelData.name = GuildChannel.name;
            channelData.id = GuildChannel.id;
            channelData.bitrate = GuildChannel.bitrate;
            channelData.userLimit = GuildChannel.userLimit;
            channelData.rateLimitPerUser = GuildChannel.rateLimitPerUser;
            channelData.permissionOverwrites = fetchOverwritesPermission(GuildChannel);
            /* Return channel data */
            resolve(channelData);
        }
    });
}

/**
 * Delete all roles, all channels, all emojis, etc... of a guild
 * @param {object} guild
 */
async function clearGuild(guild) {
    //let roleThatGivesMeAdminPermissions = guild.me.roles.filter((r) => r.permissions.has("ADMINISTRATOR"));
    guild.roles.forEach((role) => {
        if (!role.managed && role.editable && role.id === guild.id) return;
        setTimeout(() => {
            role.delete().catch((err) => {});
        }, 100)
    });
    guild.channels.forEach((channel) => {
        channel.delete().catch((err) => {});
    });
    guild.emojis.forEach((emoji) => {
        guild.deleteEmoji(emoji).catch((err) => {});
    });
    let webhooks = await guild.fetchWebhooks();
    webhooks.forEach((webhook) => {
        webhook.delete().catch((err) => {});
    });
    let bans = await guild.fetchBans();
    bans.forEach((ban) => {
        guild.unban(ban.user).catch((err) => {});
    });
    return;
}







module.exports = {
    fetchOverwritesPermission,
    fetchChannelData,
    clearGuild,
};
