const _crypto = require('crypto');

module.exports = {


    encrypt: function (text, masterkey){
        // random initialization vector
        const iv = _crypto.randomBytes(16);

        // random salt
        const salt = _crypto.randomBytes(64);

        // a large number of iterations because of password
        const key = _crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512');

        // AES 256 GCM Mode
        const cipher = _crypto.createCipheriv('aes-256-gcm', key, iv);

        // encrypt the given text
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

        // extract the auth tag
        const tag = cipher.getAuthTag();

        // generate output
        return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
    },

    decrypt: function (encdata, masterkey){
        // base64 decoding
        const bData = Buffer.from(encdata, 'base64');
        // convert data to buffers
        const salt = bData.slice(0, 64);
        //iv
        const iv = bData.slice(64, 80);
        const tag = bData.slice(80, 96);
        const text = bData.slice(96);

        // derive key using; 32 byte key length
        const key = _crypto.pbkdf2Sync(masterkey, salt , 2145, 32, 'sha512');

        // AES 256 GCM Mode
        const decipher = _crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);
        
        // decrytp the given text
        try {
            const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
            return decrypted;
        } catch(e) {
            throw e
        }
       
    }
};