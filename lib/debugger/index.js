import { isDevelopment } from "@/utils/global"

export const Translate = (content, updates) => {

    const isModified = (route) => Object.keys(updates).includes(route)

    const addUpdate = (e, route) => {
        const raw = localStorage.getItem('updates')
        let parsed = raw ? JSON.parse(raw) : {}
        localStorage.setItem('updates', JSON.stringify({
            ...parsed,
            [ route ]: e.target.innerText
        }))
    }

    const worker = {
        elements: [],
        interval: undefined,
        t: (route) => {
            const resolvedRoute = route.split('.')
            let record
            if (isDevelopment() && isModified(route)) record = updates[route]
            else {
                record = content
                resolvedRoute.map(child => {
                    record = record[child]
                })
            }
            return isDevelopment() ? <>
                    { record }
                    <meta data-translation data-route={ route } />
                </> : record
        },
        routes: {},
        start: function () {
            worker.interval = setInterval(() => {
                if (!isDevelopment() || !document) return;
                const metas = Array.from(document.querySelectorAll('meta[data-translation]'));
                metas.map(meta => {
                    const route = meta.getAttribute('data-route');
                    const parent = meta.parentElement
                    if (isModified(route)) meta.setAttribute('data-modified', true)
                    if (parent.getAttribute('contenteditable') !== null) return;
                    parent.setAttribute('contenteditable', '');
                    if (Object.keys(worker.routes).includes(route)) return;

                    parent.addEventListener('input', (e) => addUpdate(e, route))
                    worker.routes[route] = {
                        parent: parent
                    }
                });
            }, 1000);
        },
        stop: function () {
            clearInterval(worker.interval);
            const metas = Array.from(document.querySelectorAll('meta[data-translation]'));
            metas.map(meta => {
                const parent = meta.parentElement;
                parent.removeAttribute('contenteditable');
                meta.removeAttribute('data-modified')
            });
            for (let route of Object.keys(worker.routes)) {
                worker.routes[route].parent.removeEventListener('input', addUpdate);
                delete worker.routes[route];
            }
        }
    }

    return worker
}