import React from 'react'
import CardRadio from './CardRadio'
import TranslationText from '../TranslationText'

export default function RadioGroup({ KeyGenerallist, label, options, optionsIcons = null, fieldName, values, onChange }) {
    return (
        <div className='form-group cw_p'>
            <label><TranslationText title={label} page={`Generallist?.${KeyGenerallist}`} /></label>
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
