const InputField = ({ label, type = "text", value, onChange, placeholder, required = false, name }) => {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400 transition duration-200 hover:border-gray-400"
      />
    </div>
  );
};

export default InputField;
