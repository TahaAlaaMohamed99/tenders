import React from 'react'
import CardRadio from './CardRadio'
import TranslationText from '../TranslationText'

export default function RadioGroup({ KeyGenerallist, label, options, optionsIcons = null, fieldName, values, onChange }) {
    return (
        <div className='w-full flex flex-col'>
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
}
