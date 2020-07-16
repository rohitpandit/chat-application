const generateMessage = (text) =>{
    return {
        text,
        createdAt : new Date().getTime()
    }
}

const generateLocationMessage = (URL) =>{
    return {
        URL,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}