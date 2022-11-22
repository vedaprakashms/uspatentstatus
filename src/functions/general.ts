export let splitIntoChunk = async (params: string[]) => {
    let templist = []
    while (params.length > 0) {
        let tempArray
        tempArray = params.splice(0, 700)
        //console.log(tempArray.join(' '))
        templist.push(tempArray)
    }
    return templist
}
