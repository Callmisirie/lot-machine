import Image from "next/image";

const Input = ({ 
  type, label, 
  value, name, 
  handleChange, small, 
  optional, description,
  descriptionImg
}) => {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col w-fit">
        <div className="flex w-full justify-between">
          {label && (
            <label className="l2r text-n-500">
              {label}
              {optional ? <span className="l3r text-n-300">(optional)</span>
              : null}
            </label>
          )}
          {description && (
            <div className="flex items-center">
              <Image 
                src={descriptionImg} 
                width={24} 
                height={24} 
                alt="description icon" 
                className="" 
                priority
                /> 
              <p className="l3r text-n-300">
                {description}
              </p>
            </div>
          )}
        </div>
        <input
          className={`l2r border border-n-900 ${
            small ? "w-full" : "w-[184px]"
          } bg-transparent rounded-[8px] h-[32px] text-center text-n-700`}
          inputMode={`${type === "text"} ? "text" : "numeric"`}
          autoComplete="off" 
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
    </div>
  );
};

export default Input;