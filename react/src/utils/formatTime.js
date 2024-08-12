export default function formatCreatedAt (timestamp) {
    if (!timestamp) return ''; 

    const options = {
        // day: '2-digit',
        // month: '2-digit',
        // year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);
    return dateTimeFormat.format(new Date(timestamp));
};
