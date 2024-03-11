import Input from "./Input";

export default function InputGroup({ label, data, indent = 0, idx }) {
    const generateKey = (prefix, index) => `${prefix}-${indent}-${index}`;

    return (
        <div key={idx} className="space-y-3" style={{ paddingLeft: `${indent * 20}px` }}>
            {!!label && <p className="uppercase text-xs text-slate-600 font-bold tracking-wide mb-1 mt-5">{label}</p>}
            {
                Array.isArray(data) || typeof data === 'object' ?
                    Object.entries(data).map(([key, value], c) =>
                        Array.isArray(value) ?
                            <InputGroup
                                label={key}
                                data={value}
                                indent={indent + 1}
                                idx={generateKey(`igp-arr`, `${key}-${c}`)}
                                key={generateKey(`igp-arr`, `${key}-${c}`)}
                            /> :
                            typeof value === 'object' ?
                                Object.entries(value).map(([_key, _value], _c) =>
                                    Array.isArray(_value) ?
                                        <InputGroup
                                            label={_key}
                                            data={_value}
                                            indent={indent + 1}
                                            key={generateKey(`igp-obj`, `${_key}-${_c}`)}
                                            idx={generateKey(`igp-obj`, `${_key}-${_c}`)}
                                        /> :
                                        <Input
                                            label={_key}
                                            data={_value}
                                            key={generateKey(`i-obj-field`, `${_key}-${_c}`)}
                                            idx={generateKey(`i-obj-field`, `${_key}-${_c}`)}
                                        />
                                ) :
                            typeof value === 'string' ?
                                <Input
                                    data={value}
                                    label={ key }
                                    key={generateKey(`i-in-field`, `${key}-${c}`)}
                                    idx={generateKey(`i-in-field`, `${key}-${c}`)}
                                /> :
                                <div key={generateKey(`inv-in-field`, `${key}-${c}`)}>Invalid Value</div>
                    ) :
            typeof data === 'string' ?
                <Input
                    data={data}
                    key={generateKey(`i-field`, `${idx}`)}
                    idx={generateKey(`i-field`, `${idx}`)}
                /> :
                <div key={generateKey(`inv-field`, `${idx}`)}>Invalid Value</div>
            }
        </div>
    );
}
