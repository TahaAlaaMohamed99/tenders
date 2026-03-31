import * as Yup from "yup";
// Reusable validation schemas for custom forms or manual validation
// Note: DynamicForm generats its own validation based on config, but these can be used for
// custom components or non-form data validation.

export const emailSchema = Yup.string().email("invalidEmail").required("emailRequired");

export const employeeRecSchema = Yup.object().required('pleaseSelectEmployeeRec');

export const dateTimeFromSchema = Yup.date().required("dateTimeFromRequired");

export const nameSchema = Yup.string()
  .required('pleaseEnterName')
  .min(3, 'nameMustBeAtLeast3Characters')
  .max(50, 'nameCannotExceed50Characters');

export const NameSchema = nameSchema;

export const creationDateSchema = Yup.date().required('pleaseSelectCreationDate');

export const vacationCategorySchema = Yup.object().required('pleaseSelectVacationCategory');

export const importanceSchema = Yup.object().required('pleaseSelect');

export const loginSchema = Yup.object().shape({
  userName: Yup.string().required("user name required"),
  password: Yup.string()
    .min(6, "password must be at least 6 characters")
    .required("password required"),
});

export const userSchema = Yup.object().shape({
  code: Yup.string().required("codeRequired"),
  firstName: Yup.string().required("firstNameRequired"),
  lastName: Yup.string().required("lastNameRequired"),
  userName: Yup.string().required("userNameRequired"),
  email: Yup.string().email("invalidEmail").required("emailRequired"),
  password: Yup.string().when("id", {
    is: (id) => !id || id === 0,
    then: (schema) => schema.min(6, "passwordTooShort").required("passwordRequired"),
    otherwise: (schema) => schema.min(6, "passwordTooShort").nullable(),
  }),
  confirmedPassowrd: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "passwordsMustMatch"
  ),
});

export const roleSchema = Yup.object().shape({
  id: Yup.mixed(),
  name: nameSchema,
  code: Yup.string().when("id", {
    is: (id) => id && id > 0,
    then: (schema) => schema.required("codeRequired"),
    otherwise: (schema) => schema.nullable(),
  }),
  granted: Yup.boolean(),
});

export const RolesLineSchema = Yup.object().shape({
  roles: Yup.object().required("roleRequired"),
});

export const preventInvalidNumberInput = (e) => {
  // Allow control keys (Backspace, Delete, Tab, Escape, Enter, Arrows, Home, End)
  if (
    [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ].includes(e.key) ||
    // Allow keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+A, etc.)
    e.ctrlKey === true ||
    e.metaKey === true
  ) {
    return;
  }

  // Prevent everything that is NOT a digit (0-9)
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};
 