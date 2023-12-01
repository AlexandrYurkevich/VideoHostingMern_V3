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

export const durationFormat = (duration = 0)=>{
    let hours = Math.floor(duration / 3600);
    let minutes = Math.floor((duration % 3600) / 60); let seconds = Math.floor(duration % 60);
    if (hours < 10) { hours = '0' + hours; }
    if (minutes < 10) { minutes = '0' + minutes; }
    if (seconds < 10) { seconds = '0' + seconds; }
    return((hours > 0 ? hours + ':' : '')+ minutes+':'+seconds)
}
export const accessStatusFormat = (status) =>{
    switch (status) {
        case 0: return "Черновик"
        case 1: return "Доступ по ссылке"
        default: return "Общий доступ"
    }
}
