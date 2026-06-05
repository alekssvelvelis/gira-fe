

type FieldOption = { label: string; value: string };

type FieldConfig =
    | { type: 'text' | 'email' | 'password' | 'number' | 'date'; }
    | { type: 'select'; options: FieldOption[]; }
    | { type: 'textarea'; rows?: number; };


export interface FormFieldProps {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    config: FieldConfig;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    specialStyling?: boolean;
}

export function FormField({ name, label, value, onChange, config, placeholder, error, disabled, specialStyling }: FormFieldProps) {
    const baseClass = `w-full px-3 py-2 border rounded-md bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary`;
    const errorClass = error ? 'border-red-500' : 'border-accent';

    const renderInput = () => {
        switch (config.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'number':
            case 'date':
                return (
                    <input
                        id={name}
                        type={config.type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`${baseClass} ${errorClass}`}
                    />
                );

            case 'select':
                return (
                    <select
                        id={name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        className={`${baseClass} ${errorClass}`}
                    >
                        {placeholder && <option value='' disabled>{placeholder}</option>}
                        {config.options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                );

            case 'textarea':
                return (
                    <textarea
                        id={name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={config.rows ?? 3}
                        className={`${baseClass} ${errorClass} resize-none`}
                    />
                );
                
        }
    };

    return (
        <div className={` ${specialStyling ? 'w-full md:w-1/2' : ''} flex  flex-col gap-1`}>
            <label htmlFor={name} className='text-sm font-medium'>{label}</label>
            {renderInput()}
            {error && <span className='text-xs text-red-500'>{error}</span>}
        </div>
    );
}