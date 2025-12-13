import React from 'react'
import { Api } from '../services/Api'
import TranslationText from '../Components/TranslationText'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';


/**
 * A custom hook to handle form submission logic.
 * 
 * It provides a function, handleSubmitFormik, that submits form data to the specified API endpoint, manages state updates, and displays notifications.
 * The function takes in the following parameters:
 * - urlApi: The API endpoint to send the form data to.
 * - values: The form values to submit.
 * - ResourcePage: The resource page identifier for translation messages.
 * - prevRoute: The previous route to navigate to on specific failures.
 * - option: The action type (e.g., "add" or "edit") to determine success/failure messages.
 * - setIsReady: A state updater function to set the "ready" status (e.g., for loading).
 * - setIsLoadingSubmit: A state updater function to manage submission loading state.
 * - setData: (Optional) A state updater function for managing additional data post-submission.
 * - navigateStepCallback: (Optional) A callback function executed upon successful response, with the record ID passed as an argument.
 * - Transaction: (Optional) Determines whether to update the data with a status of 1 (true) or not (false).
 * 
 * The function will return a function, handleSubmitFormik, for use in Components.
 */
export default function useHandleSubmit() {
    // Provides navigation functionality between routes.
    const navigate = useNavigate();
   
    /**
     * Handles form submission using the Api.post method, manages state updates, and displays notifications.
     * 
     * @param {string} urlApi - The API endpoint to send the form data to.
     * @param {Object} values - The form values to submit.
     * @param {string} ResourcePage - The resource page identifier for translation messages.
     * @param {string} prevRoute - The previous route to navigate to on specific failures.
     * @param {string} option - The action type (e.g., "add" or "edit") to determine success/failure messages.
     * @param {useState} setIsReady - A state updater function to set the "ready" status (e.g., for loading).
     * @param {useState} setIsLoadingSubmit - A state updater function to manage submission loading state.
     * @param {useState} [setData] - (Optional) A state updater function for managing additional data post-submission.
     * @param {useState} [navigateStepCallback] - (Optional) A callback function executed upon successful response, with the record ID passed as an argument.
     * @param {boolean} [Transaction = true] - (Optional) Determines whether to update the data with a status of 1 (true) or not (false).
     */
    const handleSubmitFormik = (urlApi, values, ResourcePage, prevRoute, option, setIsReady, setIsLoadingSubmit, setData, navigateStepCallback, Transaction = true) => {
        Api.post(urlApi, values) // Submit form data via POST request
            .then((res) => {
                const codeMessage = res.data.message; // Extract response message code
                if (codeMessage == 200) {
                    // Success case: Show success toast, update states, and optionally navigate or execute callback
                    toast.success(
                        <TranslationText
                            page={ResourcePage}
                            title={option == "add" ? "addedSuccessfully" : "editSuccessfully"}
                        />
                    );
                    if (setIsReady) {
                        setIsReady(false); // Reset readiness state
                    }
                    if (setData) {
                        if (Transaction) {
                            setData({ ...values, status: 1 }); // Update data with status

                        } else {
                            setData({ ...values }); // Update data with status
                        }
                    }
                    if (navigateStepCallback) {
                        navigateStepCallback(res.data.recId); // Trigger callback with the record ID
                    }
                } else if (codeMessage == 406) {
                    // Failure case: Show error toast and navigate to the previous route
                    toast.error(
                        <TranslationText
                            page={ResourcePage}
                            title={option == "add" ? "addFailed" : "notFound"}
                        />
                    );
                    navigate(prevRoute); // Redirect to previous route
                }else if (codeMessage == 400) {
                    // Failure case: Show error toast and navigate to the previous route
                    if (setData) {
                        setData({ ...values, status: 1 }); // Update data despite failure
                    }
                    toast.error(
                        <TranslationText
                            page={ResourcePage}
                            title={option == "add" ? "addFailed" : "editFailed"}
                        />
                    );// Redirect to previous route
                }else if (codeMessage == 411){
                    if (setData) {
                        setData({ ...values, status: 1 }); // Update data despite failure
                    }
                    toast.error(
                        <TranslationText
                            page={ResourcePage}
                            title="invalidHierarchy"
                        />
                    );
                }
                setIsLoadingSubmit(false); // Stop the loading indicator
            })
            .catch((error) => {
                // Handle errors: Show error toast and optionally update data with failure status
                setIsLoadingSubmit(false);
                if (setData) {
                    setData({ ...values, status: 1 }); // Update data despite failure
                }
                toast.error(
                    <TranslationText
                        page={ResourcePage}
                        title={option == "add" ? "addFailed" : "editFailed"}
                    />
                );
            });
    };

    // Return the handleSubmitFormik function for use in Components
    return { handleSubmitFormik };
}
