import { AddRow } from "@/utils/panel"

const handleJob = async (job, data) => {
    switch (job) {
        case 'AddRow':
            const path = data?.path
            const inpath = data?.inpath
            const lang = data?.lang
            const value = data?.data

            if (!path && !value && !lang && !inpath) return
            const status = await AddRow(path, lang, value, inpath)

            return status
    }

    return false
}

export default async function handler(req, res) {
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