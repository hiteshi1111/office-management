import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;

export const encrypt = (data) => {
    if (data?.length > 0){
        const encryptedText = CryptoJS.AES.encrypt(data, secretKey).toString();
        return encryptedText;
    }else{
        return "";
    }
};