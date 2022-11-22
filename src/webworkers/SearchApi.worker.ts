import axios, { AxiosResponse } from 'axios'
import { splitIntoChunk } from '../functions/general'
import path from 'path'
import { writeFile, existsSync, mkdirSync } from 'fs'
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry'

axiosRetry(axios, {
    retries: 100,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return (
            error.response?.status === 403 ||
            error.code === '429' ||
            error.code === '403' ||
            error.code === 'ERR_BAD_REQUEST' ||
            isNetworkOrIdempotentRequestError(error)
        )
    },
    onRetry(retryCount, error) {
        console.log(`retry # ${retryCount} for the error ${error}`)
    },
})

addEventListener('message', (res) => {
    console.log(res.data.type)
    let temp = JSON.parse(res.data.jsonData)
    let filePath = path.join(res.data.filepath, 'USPatentStatus')

    if (!existsSync(filePath)) {
        mkdirSync(path.join(filePath, 'data'), {
            recursive: true,
        })
        mkdirSync(path.join(filePath, 'report'), {
            recursive: true,
        })
    }

    let k: string[] = []
    temp.forEach((element: patnumber) => {
        //console.log(element.number)
        k.push(element.number as string)
    })

    splitIntoChunk(k).then((r) => {
        console.log(r)

        for (let index = 0; index < r.length; index++) {
            const element = r[index]
            console.log(element.join(' '))
            if (res.data.type === 'App') {
                axios({
                    url: 'https://ped.uspto.gov/api/queries',
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    data: {
                        searchText: 'applId:(' + element.join(' ') + ')',
                        fq: [],
                        fl: '*',
                        mm: '0%',
                        df: 'patentTitle',
                        qf: 'appEarlyPubNumber applId appLocation appType appStatus_txt appConfrNumber appCustNumber appGrpArtNumber appCls appSubCls appEntityStatus_txt patentNumber patentTitle inventorName firstNamedApplicant appExamName appExamPrefrdName appAttrDockNumber appPCTNumber appIntlPubNumber wipoEarlyPubNumber pctAppType firstInventorFile appClsSubCls rankAndInventorsList',
                        facet: 'true',
                        sort: 'applId asc',
                        start: '0',
                    },
                }).then((response: AxiosResponse) => {
                    console.log(response.data.queryId)
                    axios({
                        url:
                            'https://ped.uspto.gov/api/queries/' +
                            response.data.queryId +
                            '/package?format=JSON',
                        method: 'put',
                        headers: { 'Content-Type': 'application/json' },
                    }).then((r) => {
                        console.log(r.request)

                        axios({
                            url:
                                'https://ped.uspto.gov/api/queries/' +
                                response.data.queryId +
                                '/download?format=JSON',
                            method: 'get',
                            responseType: 'arraybuffer',
                            headers: { 'Content-Type': 'application/json' },
                        }).then((zip: any) => {
                            console.log(zip)
                            writeFile(
                                path.join(
                                    filePath,
                                    'data',
                                    response.data.queryId + '.zip'
                                ),
                                Buffer.from(new Uint8Array(zip.data)),
                                () => {
                                    postMessage({
                                        msg: `wrote application data in zip format to ${path.join(
                                            filePath,
                                            'data',
                                            response.data.queryId + '.zip'
                                        )}`,
                                        queryid: response.data.queryId,
                                    })
                                }
                            )
                            // writeFileSync(
                            //     path.join(
                            //         filePath,
                            //         'data',
                            //         response.data.queryId + '.zip'
                            //     ),
                            //     Buffer.from(new Uint8Array(zip.data)),
                            //     {
                            //         encoding: 'binary',
                            //     }
                            // )
                        })
                    })
                })
            } else {
                axios({
                    url: 'https://ped.uspto.gov/api/queries',
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    data: {
                        searchText: 'patentNumber:(' + element.join(' ') + ')',
                        fq: [],
                        fl: '*',
                        mm: '0%',
                        df: 'patentTitle',
                        qf: 'appEarlyPubNumber applId appLocation appType appStatus_txt appConfrNumber appCustNumber appGrpArtNumber appCls appSubCls appEntityStatus_txt patentNumber patentTitle inventorName firstNamedApplicant appExamName appExamPrefrdName appAttrDockNumber appPCTNumber appIntlPubNumber wipoEarlyPubNumber pctAppType firstInventorFile appClsSubCls rankAndInventorsList',
                        facet: 'true',
                        sort: 'applId asc',
                        start: '0',
                    },
                }).then((response: AxiosResponse) => {
                    console.log(response.data.queryId)
                    axios({
                        url:
                            'https://ped.uspto.gov/api/queries/' +
                            response.data.queryId +
                            '/package?format=JSON',
                        method: 'put',
                        headers: { 'Content-Type': 'application/json' },
                    }).then((r) => {
                        console.log(r.request)

                        axios({
                            url:
                                'https://ped.uspto.gov/api/queries/' +
                                response.data.queryId +
                                '/download?format=JSON',
                            method: 'get',
                            responseType: 'arraybuffer',
                            headers: { 'Content-Type': 'application/json' },
                        }).then((zip: any) => {
                            console.log(zip)
                            writeFile(
                                path.join(
                                    filePath,
                                    'data',
                                    response.data.queryId + '.zip'
                                ),
                                Buffer.from(new Uint8Array(zip.data)),
                                () => {
                                    postMessage({
                                        msg: `wrote Patent data in zip format to ${path.join(
                                            filePath,
                                            'data',
                                            response.data.queryId + '.zip'
                                        )}`,
                                        queryid: response.data.queryId,
                                    })
                                }
                            )
                            // writeFileSync(
                            //     path.join(
                            //         filePath,
                            //         'data',
                            //         response.data.queryId + '.zip'
                            //     ),
                            //     Buffer.from(new Uint8Array(zip.data)),
                            //     {
                            //         encoding: 'binary',
                            //     }
                            // )
                            postMessage({
                                msg: `wrote data in zip formatto ${path.join(
                                    filePath,
                                    'data',
                                    response.data.queryId + '.zip'
                                )}`,
                                queryid: response.data.queryId,
                            })
                        })
                    })
                })
            }
        }
    })
})
