const ValueField = ({ 
  label, value,
}) => {
  return (
    <div className="flex flex-col w-fit">
      <div className="flex w-full justify-start">
          <label className="l2r text-n-500">
            {label}
          </label>
      </div>
      <div
      className={`flex justify-center w-[184px]
      items-center border border-n-500 
      bg-transparent rounded-[8px] h-[32px] 
      `}>
        <p className="l2r text-n-500">
          {value}
        </p>
      </div>
    </div>
  );
};

export default ValueField;