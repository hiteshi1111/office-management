export default function getInitialLetter(str) {
    if (!str) return ''; 
    const words = str.split(' ');
    const initials = words.map(word => word.charAt(0));
    return initials.join('').slice(0, 3);
}