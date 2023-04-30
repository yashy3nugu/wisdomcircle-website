import React from "react";
import { cn } from "@/lib/utils";
import { Country } from "@/data/countries";
import CountryData from "@/data/countries.json";

import { Field, FieldHookConfig, useField } from "formik";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  numberName: string;
  countryName: string;
};

const MobileInput: React.FC<Props> = ({ type = "text", ...props }) => {
  const [numberField, { touched: numberTouched, error: numberError }] =
    useField<FieldHookConfig<string | number>>(props.numberName);
  const [countryField] =
    useField<FieldHookConfig<string | number>>(props.countryName);

  const countries: Country[] = CountryData;

  return (
    <div>
      <div className="flex gap-3">
        <Field
          className="flex h-12 w-20 rounded-md border-2 bg-transparent  py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
          component="select"
          id={countryField.name}
          {...countryField}
        >
          {countries.map(({ dial_code }, idx) => (
            <option className="" value={dial_code} key={idx}>
              {`${dial_code}`}
            </option>
          ))}
        </Field>
        <Field
          className={cn(
            "flex h-12 w-full rounded-md border-2 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
            numberTouched && numberError
              ? "border-danger text-danger placeholder:text-danger"
              : "border-divider"
          )}
          type={type}
          id={numberField.name}
          {...numberField}
          {...props}
        />
      </div>

      {numberTouched && numberError ? (
        <small className="mb-2 block text-danger">{numberError}</small>
      ) : (
        <small className="block mb-2">&nbsp;</small>
      )}
    </div>
  );
};

export default MobileInput;
