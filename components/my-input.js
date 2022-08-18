import styles from "@/styles/error-input.module.scss";

export default function ({ field, form, ...props }) {
  return (
    <input
      {...field}
      {...props}
      className={
        form.touched?.[field.name] &&
        form.errors?.[field.name] &&
        styles.errorInput
      }
    />
  );
}
