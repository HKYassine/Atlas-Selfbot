const ClientDataResolver = global["ClientDataResolver"];
const fetch = require("node-fetch")
/**
 * A rich embed to be sent with a message with a fluent interface for creation.
 */
class TextEmbed {
    /**
     *
     * @param data Data to set in the rich embed
     */
    constructor(data = {}) {
        this.title = data.title;
        this.description = data.description;
        this.url = data.url;
        this.color = data.color;
        this.author = data.author;
        this.timestamp = data.timestamp;
        this.fields = data.fields || [];
        this.thumbnail = data.thumbnail;
        this.image = data.image;
        this.footer = data.footer;
        this.file = data.file;
        this.files = [];
    }
    /**
     * Sets the title of this embed.
     * @param {StringResolvable} title The title
     * @returns {TextEmbed} This embed
     */
    setTitle(title) {
        title = resolveString(title);
        if (title.length > 256)
            throw new RangeError('RichEmbed titles may not exceed 256 characters.');
        this.title = title;
        return this;
    }
    /**
     * Sets the description of this embed.
     * @param {StringResolvable} description The description
     * @returns {TextEmbed} This embed
     */
    setDescription(description) {
        description = resolveString(description);
        if (description.length > 2048)
            throw new RangeError('RichEmbed descriptions may not exceed 2048 characters.');
        this.description = description;
        return this;
    }
    /**
     * Sets the URL of this embed.
     * @param {string} url The URL
     * @returns {TextEmbed} This embed
     */
    setURL(url) {
        this.url = url;
        return this;
    }
    /**
     * Sets the color of this embed.
     * @param {ColorResolvable} color The color of the embed
     * @returns {TextEmbed} This embed
     */
    setColor(color) {
        this.color = ClientDataResolver.resolveColor(color);
        return this;
    }
    /**
     * Sets the author of this embed.
     * @param {StringResolvable} name The name of the author
     * @param {string} [icon] The icon URL of the author
     * @param {string} [url] The URL of the author
     * @returns {TextEmbed} This embed
     */
    setAuthor(name, icon, url) {
        this.author = {
            name: resolveString(name),
            icon_url: icon,
            url
        };
        return this;
    }
    /**
     * Sets the timestamp of this embed.
     * @param {Date|number} [timestamp=Date.now()] The timestamp or date
     * @returns {TextEmbed} This embed
     */
    setTimestamp(timestamp = Date.now()) {
        if (timestamp instanceof Date)
            timestamp = timestamp.getTime();
        this.timestamp = timestamp;
        return this;
    }
    /**
     * Adds a field to the embed (max 25).
     * @param {StringResolvable} name The name of the field
     * @param {StringResolvable} value The value of the field
     * @param {boolean} [inline=false] Set the field to display inline
     * @returns {TextEmbed} This embed
     */
    addField(name, value, inline = false) {
        if (this.fields.length >= 25)
            throw new RangeError('RichEmbeds may not exceed 25 fields.');
        name = resolveString(name);
        if (name.length > 256)
            throw new RangeError('RichEmbed field names may not exceed 256 characters.');
        if (!/\S/.test(name))
            throw new RangeError('RichEmbed field names may not be empty.');
        value = resolveString(value);
        if (value.length > 1024)
            throw new RangeError('RichEmbed field values may not exceed 1024 characters.');
        if (!/\S/.test(value))
            throw new RangeError('RichEmbed field values may not be empty.');
        this.fields.push({
            name,
            value,
            inline
        });
        return this;
    }
    /**
     * Convenience function for `<RichEmbed>.addField('\u200B', '\u200B', inline)`.
     * @param {boolean} [inline=false] Set the field to display inline
     * @returns {TextEmbed} This embed
     */
    addBlankField(inline = false) {
        return this.addField('​', '​', inline);
    }
    /**
     * Set the thumbnail of this embed.
     * @param {string} url The URL of the thumbnail
     * @returns {TextEmbed} This embed
     */
    setThumbnail(url) {
        this.thumbnail = {
            url
        };
        return this;
    }
    /**
     * Set the image of this embed.
     * @param {string} url The URL of the image
     * @returns {TextEmbed} This embed
     */
    setImage(url) {
        this.image = {
            url
        };
        return this;
    }
    /**
     * Sets the footer of this embed.
     * @param {StringResolvable} text The text of the footer
     * @param {string} [icon] The icon URL of the footer
     * @returns {TextEmbed} This embed
     */
    setFooter(text, icon) {
        text = resolveString(text);
        if (text.length > 2048)
            throw new RangeError('RichEmbed footer text may not exceed 2048 characters.');
        this.footer = {
            text,
            icon_url: icon
        };
        return this;
    }
    /**
     * Sets the file to upload alongside the embed. This file can be accessed via `attachment://fileName.extension` when
     * setting an embed image or author/footer icons. Only one file may be attached.
     * @param file Local path or URL to the file to attach,
     * or valid FileOptions for a file to attach
     * @return This embed
     */
    attachFile(file) {
        if (this.file)
            throw new RangeError('You may not upload more than one file at once.');
        if (file && file["file"])
            file = file["file"];
        this.file = file;
        return this;
    }
    /**
     * Sets the files to upload alongside the embed. A file can be accessed via `attachment://fileName.extension` when
     * setting an embed image or author/footer icons. Multiple files can be attached.
     * @param {Array<FileOptions|string|Attachment>} files Files to attach
     * @returns {TextEmbed}
     */
    attachFiles(files) {
        files = files.map(file => file && file["file"] ? file.file : file);
        this.files = this.files.concat(files);
        return this;
    }
    /**
     * The accumulated length for the embed title, description, fields, author and footer text
     * @type {number}
     * @readonly
     */
    get length() {
        return ((this.title ? this.title.length : 0) +
            (this.description ? this.description.length : 0) +
            (this.fields.length >= 1 ? this.fields.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0) : 0) +
            (this.footer ? this.footer.text.length : 0) +
            (this.author ? this.author.name.length : 0));
    }
    /**
     * Transforms the embed object to be processed.
     * @returns {Object} The raw data of this embed
     * @private
     */
    _apiTransform() {
        let text = ""
        if (this.image)
            text += `${this.image.url}\n`;
        text += "```diff\n";
        if (this.title)
            text += `- ${this.title}\n\n`;
        if (this.description)
            text += this.description + "\n\n";
        if (this.url)
            text += this.url + "\n";
        this.fields.forEach(field => {
            text += `- ${field.name}\n${field.value}\n`;
        });
        if (this.timestamp)
            text += new Date(this.timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/\-/g, '/') + "\n";
            
        
        if (this.footer)
            text += this.footer.text;
            text += "```";
        return text;
        

    }
}
module.exports = TextEmbed;
function resolveString(data) {
    if (typeof data === 'string')
        return data;
    if (data instanceof Array)
        return data.join('\n');
    return String(data);
}