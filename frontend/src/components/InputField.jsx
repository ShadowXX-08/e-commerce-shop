import React from 'react';

const InputField = ({ 
  label, type = "text", value, onChange, placeholder, 
  required = false, name, icon: Icon, rightElement, error 
}) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full py-3.5 rounded-2xl outline-none transition-all border font-medium
            ${Icon ? 'pl-11' : 'px-4'} 
            ${rightElement ? 'pr-12' : 'pr-4'}
            ${error ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}
          `}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 ml-2 text-xs font-bold text-rose-500">{error}</p>}
    </div>
  );
};

export default InputField;