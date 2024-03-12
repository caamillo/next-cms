import Input from "./Input";
import Image from "next/image";
import plus from '@/assets/icons/plus.svg'

export default function InputGroup({ label, data, indent = 0, idx }) {
    const generateKey = (prefix, index) => `${prefix}-${indent}-${index}`;

    return (
        <div key={idx} className="space-y-3" style={{ paddingLeft: `${indent * 20}px` }}>
            {
                !!label &&
                    <div className="flex items-center gap-3 mt-5">
                        <p className="uppercase text-xs text-slate-600 font-bold tracking-wide">{label}</p>
                        {
                            Array.isArray(data) || typeof data === 'object' &&
                                <Image
                                    src={ plus }
                                    width={ 13 }
                                    height={ 13 }
                                    className="bg-indigo-600 w-5 h-5 px-1 rounded-md cursor-pointer"
                                />
                        }
                    </div>
            }
            {
                Array.isArray(data) || typeof data === 'object' ?
                    Object.entries(data).map(([key, value], c) =>
                        Array.isArray(value) || typeof value === 'object' ?
                            <InputGroup
                                label={key}
                                data={value}
                                indent={indent + 1}
                                idx={generateKey(`igp-arr`, `${key}-${c}`)}
                                key={generateKey(`igp-arr`, `${key}-${c}`)}
                            /> :
                            typeof value === 'object' ?
                            <Input
                                label={_key}
                                data={_value}
                                key={generateKey(`i-obj-field`, `${_key}-${_c}`)}
                                idx={generateKey(`i-obj-field`, `${_key}-${_c}`)}
                            /> :
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
