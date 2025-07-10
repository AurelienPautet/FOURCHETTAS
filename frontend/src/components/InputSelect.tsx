interface InputFieldProps {
  legend: string;
  placeholder: string;
  optional?: boolean;
  options: { id: number; name: string }[];
  set: (value: number) => void;
}

function InputSelect({
  legend,
  placeholder,
  optional,
  options,
  set,
}: InputFieldProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend text-xl">{legend}</legend>
      <select
        defaultValue={placeholder}
        className="select"
        onChange={(e) => set(Number(e.target.value))}
      >
        <option disabled={true}>{placeholder}</option>
        {options.map((option, index) => {
          return (
            <option key={index} value={option.id}>
              {option.name}
            </option>
          );
        })}
      </select>
      {optional && <span className="label">Optional</span>}
    </fieldset>
  );
}

export default InputSelect;
