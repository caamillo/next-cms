import { isProduction } from "@/utils/global"
import { AddRow, UpdateRow } from "@/utils/panel"

const handleJob = async (job, data) => {
    const path = data?.path
    const inpath = data?.inpath
    const lang = data?.lang
    const value = data?.data

    if (!path && !value && !lang && !inpath) return
    
    switch (job) {
        case 'AddRow':
            return await AddRow(path, lang, value, inpath)
        case 'UpdateRow':
            return await UpdateRow(path, lang, value, inpath)
    }

    return false
}

export default async function handler(req, res) {
    if (isProduction()) return res.status(401)

    if (req.method === 'POST') {
        let dataParse

        try {
            dataParse = JSON.parse(req.body)
        } catch (e) {
            return res.status(400)
        }

        const { job, data } = dataParse
        const status = await handleJob(job, data)

        if (status) res.status(200).json({
            message: 'Done!'
        })

        else res.status(500).json({
            message: 'Something went wrong...'
        })
    }
}