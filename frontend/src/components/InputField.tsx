interface InputFieldProps {
  legend: string;
  placeholder: string;
  optional?: boolean;
  set: (value: string) => void;
}

function InputField({ legend, placeholder, optional, set }: InputFieldProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend text-xl">{legend}</legend>
      <input
        type="text"
        className="input text-2xl rounded-md"
        placeholder={placeholder}
        onChange={(e) => set(e.target.value)}
      />
      {optional && <p className="label">Optional</p>}
    </fieldset>
  );
}

export default InputField;
