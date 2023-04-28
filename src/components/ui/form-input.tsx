import React from "react";
import { cn } from "@/lib/utils";

import { Field, FieldHookConfig, useField } from "formik";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const FormInput: React.FC<Props> = ({
  label,
  type = "text",
  required = true,
  ...props
}) => {
  const [field, { touched, error }] = useField<
    FieldHookConfig<string | number>
  >(props.name!);

  return (
    <div>
      <Field
        className={cn(
          "flex h-12 w-full rounded-md border-2 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
          touched && error
            ? "border-danger text-danger placeholder:text-danger"
            : "border-divider"
        )}
        type={type}
        id={field.name}
        {...field}
        {...props}
      />
      {touched && error ? (
        <small className="text-danger">
          {"Please enter a valid email address"}
        </small>
      ) : (
        <small>&nbsp;</small>
      )}
    </div>
  );
};

export default FormInput;
