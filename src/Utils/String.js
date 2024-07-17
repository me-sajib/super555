exports.capitalizeWordsInSentence = (sentence) => {
    const words = sentence.split(' ')
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    const capitalizedSentence = capitalizedWords.join(' ')
    return capitalizedSentence
}

exports.capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
