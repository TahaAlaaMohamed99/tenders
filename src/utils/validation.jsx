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

export const creationDateSchema = Yup.date().required('pleaseSelectCreationDate');

export const vacationCategorySchema = Yup.object().required('pleaseSelectVacationCategory');

export const importanceSchema = Yup.object().required('pleaseSelect');

export const loginSchema = Yup.object().shape({
  userName: Yup.string().required("user name required"),
  password: Yup.string()
    .min(6, "password must be at least 6 characters")
    .required("password required"),
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
 