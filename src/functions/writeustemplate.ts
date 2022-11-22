import { utils, writeFileXLSX } from 'xlsx'
import { useToast } from 'vue-toastification'

let usTemplate = async () => {
    const toast = useToast()
    toast.success(
        'Exported the excel sheet, please save it in required place',
        { timeout: 2000 }
    )
    const USrows = [
        {
            patNo: 'US7925623B2',
            appNo: 'US14/462,369',
        },
        {
            patNo: 'US7246140B2',
            appNo: 'US13/778,175',
        },
    ]

    const worksheet = utils.json_to_sheet(USrows)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'USTemplate')

    /* fix headers */
    utils.sheet_add_aoa(worksheet, [['Patent Number', 'Application Number']], {
        origin: 'A1',
    })

    /* create an XLSX file and try to save to Presidents.xlsx */
    writeFileXLSX(workbook, 'US Template.xlsx')
}

export { usTemplate }
