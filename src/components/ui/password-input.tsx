import React, { useState } from "react";
import { cn } from "@/lib/utils";

import { Field, FieldHookConfig, useField } from "formik";
import { Button } from "./button";
import Eye from "../icons/eye";
import CrossedEye from "../icons/crossed-eye";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const PasswordInput: React.FC<Props> = ({
  label,
  type = "text",
  required = true,
  ...props
}) => {
  const [field, { touched, error }] = useField<
    FieldHookConfig<string | number>
  >(props.name!);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {/* appearance-none block rounded px-4 focus:outline-transparent focus:outline
      disabled:text-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed
      pr-0 text-red-400 placeholder:text-red-400 h-12 text-sm md:text-base
      font-poppins font-normal box-border w-full bg-transparent */}
      <div
        className={cn(
          "flex w-full items-center rounded rounded border border-2 border-danger focus:border-danger",
          //   touched && error
          touched && error ? "border-danger" : "border-divider"
        )}
      >
        <div className="flex w-full flex-col">
          <Field
            className={cn(
              "box-border block h-10 appearance-none rounded bg-transparent px-3 pr-0 text-sm placeholder:text-muted-foreground focus:outline-none",
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
          {showPassword ? <CrossedEye error={error} /> : <Eye error={error} />}
        </Button>
      </div>

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

export default PasswordInput;
