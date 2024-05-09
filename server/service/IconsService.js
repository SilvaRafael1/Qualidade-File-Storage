const path = require("path")

function IconURL(filename) {
    let IconURL = "http://localhost:3000/icons";
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
            
        default:
            IconURL += "/file.png";
    }

    return IconURL
}

module.exports = IconURL;