export function formatDate(inputDate) {
    if (!inputDate) return '---';

    const date = new Date(inputDate);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Construct the formatted date string
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
}

export function formatDateForCompare(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

export function formatBirthday(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

export function formatActivityDate(inputDate) {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}

export function formatDateForInput(date) {
    if (!date) return '';
    const d = new Date(date);
    const pad = (num) => num.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};


export function formatDateAndTime(date) {
    if (!date) return "---";

    const parsedDate = new Date(date);
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    return parsedDate.toLocaleDateString('en-US', options);
}


