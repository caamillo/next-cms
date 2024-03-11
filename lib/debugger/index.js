import { isDevelopment } from "@/utils/global"
export const Translate = (content) => {
    let interval

    const worker = {
        toggle: false,
        elements: [],
        t: (route) => {
            const resolvedRoute = route.split('.')
            let record = content
            resolvedRoute.map(child => {
                record = record[child]
            })
            return isDevelopment() ? <>
                    { record }
                    <meta data-translation />
                </> : record
        },
        loop: () => interval = setInterval(() => {
            if (!isDevelopment() || !document) return
            const metas = Array.from(document.querySelectorAll('meta[data-translation]'))
            metas.map(meta => {
                const parent = meta.parentElement
                if (worker.toggle) parent.setAttribute('contenteditable', '')
                else parent.removeAttribute('contenteditable')
                // parent.removeChild(meta)
            })
            if (!worker.toggle) clearInterval(interval)
        }, 1000)
    }

    return worker
}