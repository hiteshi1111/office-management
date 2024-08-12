const CryptoJS = require("crypto-js");

let service = {};
service.passwordEncryption = passwordEncryption;
service.passwordDecryption = passwordDecryption;
service.decrypt = decrypt;

function passwordEncryption(password) {
    const encryptedData = CryptoJS.AES.encrypt(password, process.env.PASSWORD_ALGORITHM).toString();
    return encryptedData;
}

function passwordDecryption(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.PASSWORD_ALGORITHM);
    const password = bytes.toString(CryptoJS.enc.Utf8);
    return password;
}

function decrypt(encryptedData) {
    const secretKey = process.env.ENCRYPTION_KEY;
    if (encryptedData?.length > 0){
        const ciphertext = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = ciphertext.toString(CryptoJS.enc.Utf8);
        return decryptedData;
    }else{
        return "";
    }
}

module.exports = service;