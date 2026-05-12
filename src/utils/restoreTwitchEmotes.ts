export const restoreEmotes = (translatedText: string, emoteMap: string[]): string => {
    let finalResult = translatedText
    emoteMap.forEach((originalValue, index) => {
        finalResult = finalResult.replace(`TOKEN_${index}`, originalValue)
    })
    return finalResult
}