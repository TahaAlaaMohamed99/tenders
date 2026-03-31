import TranslationText from './TranslationText';
import '../Styles/components/Stepper/Stepper.scss';
import useDeviceType from '../Hooks/useDeviceType';
import { Children, useRef, useState, useEffect } from 'react';

/**
 * Higher-order component representing a single step.
 * Encapsulates step-specific logic and UI.
 */
export const Step = ({ step, children, className }) => {
  return <div className={className} data-step={step}>{children}</div>;
};

/**
 * SOLID Stepper Component
 * 
 * @param {string} direction - "horizontal" or "vertical"
 * @param {string} option - "add" or "edit" (unused but accepted for pattern)
 * @param {string|number} id - Record ID (unused but accepted for pattern)
 * @param {Array} steps - Array of step objects { title, ResourcePage, icon, onClick, disabled }
 * @param {number} activeStep - Current step index
 * @param {string} ResourcePage - Default localization namespace
 */
const Stepper = ({
  direction = "horizontal",
  steps,
  activeStep,
  id,
  option,
  children,
  ResourcePage,
  className = ""
}) => {
  if (!steps || !steps.length) return null;

  const isEdit = option === "edit" && Number(id) > 0;
  const stepperRef = useRef(null);
  const [totalWidth, setTotalWidth] = useState(0);
  const deviceType = useDeviceType();

  useEffect(() => {
    if (stepperRef.current) {
      const stepperList = stepperRef.current;
      let widthSum = 0;
      const childrenArr = stepperList.children;
      for (let i = 0; i < childrenArr.length; i++) {
        widthSum += childrenArr[i].offsetWidth;
      }
      setTotalWidth(isEdit ? widthSum : widthSum + ((steps.length - 1) * 192));
    }
  }, [steps, children, isEdit]);

  return (
    <div className={"stepper_container " + (direction === "horizontal" ? "stepper_container_horizontal " : "stepper_container_vertical ") + (className)}>
      <div className='stepes_container'>
        <ol 
          className={'stepper ' + (steps.length > 2 ? "gap-3" : "")} 
          style={{ width: deviceType === "mobile" ? "100%" : totalWidth + "px" }} 
          ref={stepperRef}
        >
          {steps.map((step, index) => {
            const isActiveStep = isEdit ? step.step === activeStep : step.step <= activeStep;
            return (
              <li 
                key={index}
                onClick={() => isEdit && !step.disabled ? step.onClick() : ""} 
                className={isEdit ? `tab ${isActiveStep ? "active_tab" : "default_tab"} ${step.disabled ? "disabled" : ""} ` : `step ${isActiveStep ? "active_step" : "default_step"} ${step.disabled ? "disabled" : ""}`} 
              >
                <div className='Content'>
                  <div className='icon'>
                    {step.icon}
                  </div>
                  <h3 className='title'>
                    <TranslationText page={step?.ResourcePage || ResourcePage} title={step.title} /> 
                  </h3>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="step_content">
        {Children.map(children, (child) => {
          if (child && child.props.step == activeStep) {
            return <div className="step_detail">{child}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Stepper;
