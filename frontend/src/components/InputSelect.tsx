interface InputFieldProps {
  legend: string;
  placeholder: string;
  optional?: boolean;
  options: string[];
}

function InputSelect({
  legend,
  placeholder,
  optional,
  options,
}: InputFieldProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{legend}</legend>
      <select defaultValue={placeholder} className="select">
        <option disabled={true}>{placeholder}</option>
        {options.map((option, index) => {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        })}
      </select>
      {optional && <span className="label">Optional</span>}
    </fieldset>
  );
}

export default InputSelect;
