interface InputFieldProps {
  legend: string;
  placeholder: string;
  optional?: boolean;
}

function InputField({ legend, placeholder, optional }: InputFieldProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend text-xl">{legend}</legend>
      <input
        type="text"
        className="input text-2xl rounded-md"
        placeholder={placeholder}
      />
      {optional && <p className="label">Optional</p>}
    </fieldset>
  );
}

export default InputField;
