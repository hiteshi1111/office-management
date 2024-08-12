import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;

export const decrypt = (data) => {
    if (data?.length > 0){
        const ciphertext = CryptoJS.AES.decrypt(data, secretKey);
        const decryptedData = ciphertext.toString(CryptoJS.enc.Utf8);
        return decryptedData;
    }else{
        return "";
    }
};