import type { Ref } from "react";

interface InputFieldProps {
  legend: string;
  placeholder: string;
  value: string;
  optional?: boolean;
  ref: Ref<HTMLInputElement>;
  set: (value: string) => void;
}

function InputField({
  legend,
  placeholder,
  value,
  optional,
  set,
  ref,
}: InputFieldProps) {
  return (
    <fieldset className="fieldset gi">
      <legend className="fieldset-legend text-xl">{legend}</legend>
      <input
        type="text"
        ref={ref}
        className="input validator text-2xl rounded-md"
        required
        minLength={3}
        maxLength={30}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          set(e.target.value);
          e.target?.setCustomValidity("");
        }}
      />
      <p className="validator-hint mt-[2px]">Entre 3 et 30 caractères</p>

      {optional && <p className="label">Optionnel</p>}
    </fieldset>
  );
}

export default InputField;
