export const config = {
    backendUrl: 'http://localhost:3001'
};

export const timeformat = (timestamp)=> {
    const date = new Date(timestamp);

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');

    const formattedTimestamp = `${hours}:${minutes} ${day}.${month}`;
    return formattedTimestamp;
}
