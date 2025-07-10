interface InputFieldProps {
  legend: string;
  placeholder: string;
  value: string;
  optional?: boolean;
  set: (value: string) => void;
}

function InputField({
  legend,
  placeholder,
  value,
  optional,
  set,
}: InputFieldProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend text-xl">{legend}</legend>
      <input
        type="text"
        className="input validator text-2xl rounded-md"
        required
        minLength={3}
        maxLength={30}
        placeholder={placeholder}
        value={value}
        onChange={(e) => set(e.target.value)}
      />
      <p className="validator-hint">Entre 3 et 30 caractères</p>

      {optional && <p className="label">Optionnel</p>}
    </fieldset>
  );
}

export default InputField;
