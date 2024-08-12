import emojiRegex from "emoji-regex";

export const isEmojiMessage = (message) => {
    const regex = emojiRegex();
    const match = message.match(regex);
    return match && match.join('') === message;
};