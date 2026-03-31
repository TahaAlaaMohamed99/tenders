import React from 'react'
import CardRadio from './CardRadio'
import TranslationText from '../TranslationText'

const RadioGroup = ({ KeyGenerallist, label, options, optionsIcons = null, fieldName, values, onChange, ResourcePage, ref }) => {
    return (
        <div ref={ref} className='w-full flex flex-col' tabIndex={-1}>
            <label className="text-sm font-medium text-titleColor dark:text-titleColorDark mb-2"><TranslationText title={label} page={ResourcePage || `Generallist?.${KeyGenerallist}`} /></label>
            <div className='grid grid-cols-2 gap-3'>
                {options?.map((option, index) => (
                    <CardRadio
                        key={index}
                        label={option.label}
                        value={option.value}
                        icon={optionsIcons && optionsIcons[option.value]?.icon}
                        onChange={() => onChange(option.value)}
                        checked={option.value == values[fieldName]}
                        ResourcePage={ResourcePage}
                    />
                ))}
            </div>
        </div>
    );
};

export default RadioGroup;
