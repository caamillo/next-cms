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
                    <meta data-translation={ route } />
                </> : record
        },
        updates: [],
        observers: {},
        loop: () => interval = setInterval(() => {
            if (!isDevelopment() || !document) return
            const metas = Array.from(document.querySelectorAll('meta[data-translation]'))
            metas.map(meta => {
                const parent = meta.parentElement
                if (worker.toggle) {
                    parent.setAttribute('contenteditable', '')
                    const route = meta.getAttribute('data-translation')
                    console.log(route)
                    if (!Object.keys(worker.observers).includes(route)) {
                        console.log('init')
                        const observer = new MutationObserver(mutations => {
                            for (let m of mutations)
                                console.log(m.type)
                        })
                        observer.observe(parent, {
                            childList: true,
                            characterData: true,
                            attributes: true
                        })
                        worker.observers[route] = observer
                    }
                } else parent.removeAttribute('contenteditable')
                // parent.removeChild(meta) DO NOT REMOVE META
            })
            if (!worker.toggle) clearInterval(interval)
        }, 1000)
    }

    return worker
}