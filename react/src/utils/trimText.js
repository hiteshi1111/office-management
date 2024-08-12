export function trimText(text, length){
    if (text.length > 0) {
        if (text.length < 31){
            return text;
        }else{
            const trimmedText = text.slice(0, length);
            const newText = `${trimmedText} ...`
            return newText
        }
    }else{
        return "----"
    }
}