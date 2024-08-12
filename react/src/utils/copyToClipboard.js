import copy from 'copy-to-clipboard';

const CopyToClipboard = (text, onCopy) => {
    copy(text);
    if (onCopy) {
        onCopy();
    }
}

export default CopyToClipboard;