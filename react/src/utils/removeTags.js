export default function removeTags(input) {
    const div = document.createElement('div');
    div.innerHTML = input;
    return div.textContent || div.innerText || '';
}