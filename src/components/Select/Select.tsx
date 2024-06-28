import autoAnimate from "@formkit/auto-animate";
import React, { KeyboardEventHandler } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

const components = {
  DropdownIndicator: null,
};

type SelectProps = {
  tags: string[];
  selectOptions: Option[];
  setTags: (value: string[]) => void;
  setOptions: (value: Option[]) => void;
};

export interface Option {
  readonly label: string;
  readonly value: string;
}

const createOption = (label: string): Option => ({
  label,
  value: label,
});

export const Select: React.FC<SelectProps> = ({
  tags,
  selectOptions,
  setOptions,
}) => {
  const [inputValue, setInputValue] = React.useState<string>("");
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    const options = tags.map((tag) => createOption(tag));
    console.log(tags);
    setOptions(options);
  }, [tags]);
  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!inputValue) return;
    if (selectOptions.some((option) => option.value === inputValue)) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        if (selectOptions.length === 3) {
          setError("Максимум 3 теги");
        } else {
          setError("");
          setOptions([...selectOptions, createOption(inputValue)]);
          setInputValue("");
          event.preventDefault();
        }
    }
  };
  const handleInputChange = (newValue: string) => {
    if (selectOptions.length >= 3) return;
    setInputValue(newValue);
  };
  return (
    <>
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={(newValue) => setOptions(newValue as unknown as Option[])}
        onInputChange={(newValue) => handleInputChange(newValue)}
        onKeyDown={handleKeyDown}
        placeholder="Напишіть щось та натисність Enter..."
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: "transperent",
            borderColor: "rgba(255, 255, 255, 0.23)",
            borderRadius: "15px",
            color: "#fff",
            cursor: "text",
            "&:hover": {
              borderColor: "#3399ff",
            },

            caretColor:
              tags.length >= 3 ? "transparent" : baseStyles.caretColor,
          }),

          input: (baseStyles, state) => ({ ...baseStyles, color: "fff" }),

          multiValue: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "5px",
            backgroundColor: "#333232",
            color: "#fff",
          }),

          multiValueLabel: (baseStyles, state) => ({
            ...baseStyles,
            color: "#fff",
          }),
        }}
        value={selectOptions}
      />
      {error && <p className="error">{error}</p>}
    </>
  );
};
