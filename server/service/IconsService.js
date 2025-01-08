const path = require("path")
require("dotenv/config")

function IconURL(filename) {
    const URL = process.env.APP_URL
    let IconURL = `https://${URL}/icons`;
    let extension = path.extname(filename);

    switch (extension) {
        case ".pdf":
            IconURL += "/pdf.png";
            break;

        case ".jpeg":
        case ".png":
        case ".jpg":
        case ".gif":
            IconURL += "/image.png";
            break;

        case ".doc":
        case ".docx":
        case ".odt":
            IconURL += "/text.png";
            break;
        
        case ".mp4":
        case ".mov":
        case ".avi":
        case ".mpg":
        case ".mpeg":
        case ".wmv":
        case ".ogg":
        case ".webm":
            IconURL += "/video.png";
            break;
        
        case ".csv":
        case ".xlsx":
        case ".xls":
        case ".rtf":
        case ".ods":
            IconURL += "/planilha.png";
            break;

        default:
            IconURL += "/file.png";
    }

    return IconURL
}

module.exports = IconURL;