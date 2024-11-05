const Input = ({ 
  type, label, 
  value, name, 
  handleChange, small, 
  optional 
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="l2r text-n-500">
          {label}
          {optional ? <span className="l3r text-n-300">(optional)</span>
          : null}
        </label>
      )}
      <input
        className={`l2r border border-n-900 ${
          small ? "w-full" : "w-[184px]"
        } bg-transparent rounded-[8px] h-[32px] text-center text-n-700`}
        inputMode={`${type === "text"} ? "text" : "numeric"`}
        value={value?.length <= 10 ? value : value?.slice(0, 10)}
        name={name}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (!inputValue || !isNaN(inputValue)) {
            if (inputValue.length <= 10) {
              handleChange(inputValue);
            }
          } else if (type === "text") {
            if (inputValue.length <= 10) {
              handleChange(inputValue);
            }
          }
        }}
      />
    </div>
  );
};

export default Input;