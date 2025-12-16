import * as Yup from "yup";
const emailYup = Yup.string().email("invalidEmail").required("emailRequired");
const employeeRecYup = Yup.object().required('pleaseSelectEmployeeRec')
const DateTimeFrom = Yup.date().required("dateTimeFromRequired")
const nameYup = Yup.string().required('pleaseEnterName').min(3, 'nameMustBeAtLeast3Characters').max(50, 'nameCannotExceed50Characters')
const creationDateYup = Yup.date().required('pleaseSelectCreationDate')
const vacationCategory = Yup.object().required('pleaseSelectVacationCategory')
const importanceYup = Yup.object().required('pleaseSelect')
export const loginSchema = Yup.object().shape({
  userName: Yup.string().required("user name required"),
  password: Yup.string()
    .min(6, "password must be at least 6 characters")
    .required("password required"),
});
 