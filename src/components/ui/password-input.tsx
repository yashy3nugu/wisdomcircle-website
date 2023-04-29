import React, { useState } from "react";
import { cn } from "@/lib/utils";

import { Field, FieldHookConfig, useField } from "formik";
import { Button } from "./button";
import Eye from "../icons/eye";
import CrossedEye from "../icons/crossed-eye";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
};

const PasswordInput: React.FC<Props> = ({ helper, ...props }) => {
  const [field, { touched, error }] = useField<
    FieldHookConfig<string | number>
  >(props.name!);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div
        className={cn(
          "flex w-full items-center rounded border border-danger focus:border-danger",
          //   touched && error
          touched && error ? "border-danger" : "border-divider"
        )}
      >
        <div className="flex w-full flex-col">
          <Field
            className={cn(
              "box-border block h-12 appearance-none rounded bg-transparent px-3 pr-0 text-sm placeholder:text-muted-foreground focus:outline-none md:text-base",
              touched && error ? "text-danger placeholder:text-danger" : ""
            )}
            type={showPassword ? "text" : "password"}
            id={field.name}
            {...field}
            {...props}
          />
        </div>

        <Button
          type="button"
          variant={"ghost"}
          onClick={() => setShowPassword((val) => !val)}
        >
          {showPassword ? (
            <CrossedEye error={touched && !!error} />
          ) : (
            <Eye error={touched && !!error} />
          )}
        </Button>
      </div>

      {touched && error ? (
        <small className="mb-2 mt-1 block text-danger">{error}</small>
      ) : (
        <small className="mb-2 mt-1 block text-brandgray">
          {!!helper ? helper : "\u00A0"}
        </small>
      )}
    </div>
  );
};

export default PasswordInput;
