import path from 'path'
addEventListener('message', (e) => {
    console.log(e.data)
    let archPath = path.join(
        e.data.filepath,
        'USPatentStatus',
        'data',
        e.data.queryid + '.zip'
    )
    let extpath = path.join(
        e.data.filepath,
        'USPatentStatus',
        'data',
        e.data.queryid
    )
    console.log(`${archPath} - ${extpath}`)
})
