import React from 'react'
import CardRadio from './CardRadio'
import TranslationText from '../TranslationText'

const RadioGroup = React.forwardRef(({ KeyGenerallist, label, options, optionsIcons = null, fieldName, values, onChange }, ref) => {
    return (
        <div ref={ref} className='w-full flex flex-col' tabIndex={-1}>
            <label className="text-sm font-medium text-titleColor dark:text-titleColorDark mb-2"><TranslationText title={label} page={`Generallist?.${KeyGenerallist}`} /></label>
            <div className='grid grid-cols-2 gap-3'>
                {options?.map((option, index) => (
                    <CardRadio
                        key={index}
                        label={option.label}
                        value={option.value}
                        icon={optionsIcons && optionsIcons[option.value]?.icon}
                        onChange={() => onChange(option.value)}
                        checked={option.value == values[fieldName]}
                    />
                ))}
            </div>
        </div>
    )
});

export default RadioGroup;
