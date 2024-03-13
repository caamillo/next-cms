import { isDevelopment } from "@/utils/global"

export const Translate = (content, updates, setUpdates) => {
    let interval

    const resolveUpdate = async () => {

    }

    const addUpdate = (e, route) => {
        setUpdates(updates => {
            return {
                ...updates,
                [ route ]: e.target.innerText
            }
        })
    }

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
        routes: {},
        loop: () => interval = setInterval(() => {
            if (!isDevelopment() || !document) return
            const metas = Array.from(document.querySelectorAll('meta[data-translation]'))
            metas.map(meta => {
                const parent = meta.parentElement
                if (worker.toggle) {
                    if (parent.getAttribute('contenteditable') !== null) return
                    parent.setAttribute('contenteditable', '')
                    const route = meta.getAttribute('data-translation')
                    // console.log(route)
                    if (Object.keys(worker.routes).includes(route)) return
                    parent.addEventListener('input', (e) => addUpdate(e, route))
                    worker.routes[route] = {
                        parent: parent
                    }
                } else parent.removeAttribute('contenteditable')
                // parent.removeChild(meta) DO NOT REMOVE META
            })
            if (!worker.toggle) {
                for (let route of Object.keys(worker.routes)) {
                    worker.routes[route].parent.removeEventListener('input', addUpdate)
                    delete worker.routes[route]
                }
                clearInterval(interval)
            }
        }, 1000)
    }

    return worker
}