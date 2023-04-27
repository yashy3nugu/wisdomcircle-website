import React from "react";

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
      {label && (
        <label htmlFor={field.name}>
          {label} {required ? <span>*</span> : null}
        </label>
      )}
      <Field type={type} id={field.name} {...field} {...props} />
      {touched && error ? <small>{error}</small> : <small>&nbsp;</small>}
    </div>
  );
};

export default FormInput;
