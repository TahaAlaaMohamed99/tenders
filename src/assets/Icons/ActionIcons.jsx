/**
 * @fileoverview Action Icons
 * 
 * Icons for user actions like save, delete, edit.
 * 
 * @module assets/Icons/ActionIcons
 */

/**
 * Save Icon
 */
export const IconSave = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <path
      fill="currentColor"
      d="M15 2H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3Zm-3 1v1.5a.5.5 0 0 0 1 0V3h.5v3.5h-7V3H12Zm5 12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h.5v4a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V3h.5a2 2 0 0 1 2 2v10Zm-3-6H6a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-6A.5.5 0 0 0 14 9Zm-.5 6h-7v-5h7v5ZM8 12h4a.5.5 0 0 0 0-1H8a.5.5 0 0 0 0 1Zm0 2h4a.5.5 0 0 0 0-1H8a.5.5 0 0 0 0 1Z"
    />
  </svg>
);

/**
 * Trash/Delete Icon
 */
export const IconTrash = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={ 16 }
    viewBox="0 0 16 16"
    className={className}
    fill="none"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="m12.44 3.504-.257 4.145M2.871 3.504l.385 6.386c.1 1.636.148 2.454.558 3.042.202.29.463.536.766.72.428.261.958.34 1.8.363"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m12.758 9.556-4.465 4.459m4.465 0L8.293 9.556"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M1.914 3.504h11.482m-3.154 0-.435-.897c-.29-.596-.434-.894-.684-1.08a1.272 1.272 0 0 0-.175-.11c-.276-.143-.608-.143-1.271-.143-.68 0-1.02 0-1.3.15a1.276 1.276 0 0 0-.178.113c-.253.194-.394.503-.676 1.12l-.386.847"
    />
  </svg>
);

/**
 * Edit Icon
 */
export const IconEdit = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Add Icon
 */
export const IconAdd = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="12"
      y1="8"
      x2="12"
      y2="16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="12"
      x2="16"
      y2="12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Close Icon
 */
export const IconClose = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Print Icon
 */
export const IconPrint = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline
      points="6 9 6 2 18 2 18 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="6"
      y="14"
      width="12"
      height="8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Search Icon
 */
export const IconSearch = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    className={className}
    fill="none"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.333 4a3.333 3.333 0 0 1 3.334 3.333m.439 3.77L14 14m-1.333-6.667A5.333 5.333 0 1 1 2 7.333a5.333 5.333 0 0 1 10.667 0Z"
    />
  </svg>
);

/**
 * Filter Icon
 */
export const IconFilter = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    className={className}
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      stroke="currentColor"
      strokeOpacity={0.8}
      strokeWidth={1.5}
      d="M11.666 12.083a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0ZM3.333 7.917a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeOpacity={0.8}
      strokeWidth={1.5}
      d="M5.833 10.833V15m0 2.5v.833M14.166 9.167V5m0-2.5v-.833M14.166 18.333V15M5.833 1.667V5"
    />
  </svg>
);


export const IconRowActions = ({ className }) => (
  <svg
    className={className}
    width={4}
    height={18}
    viewBox="0 0 4 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 14C3.1046 14 4 14.8954 4 16C4 17.1046 3.1046 18 2 18C0.8954 18 0 17.1046 0 16C0 14.8954 0.8954 14 2 14Z"
      fill="currentColor"
    />
    <path
      d="M2 7C3.1046 7 4 7.8954 4 9C4 10.1046 3.1046 11 2 11C0.8954 11 0 10.1046 0 9C0 7.8954 0.8954 7 2 7Z"
      fill="currentColor"
    />
    <path
      d="M2 0C3.1046 0 4 0.8954 4 2C4 3.1046 3.1046 4 2 4C0.8954 4 0 3.1046 0 2C0 0.8954 0.8954 0 2 0Z"
      fill="currentColor"
    />
  </svg>
);

export const IconAddDoc = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    viewBox="0 0 17 17"
    className={className}
    fill="none"
  >
    <path
      fill="currentColor"
      fillOpacity={0.8}
      d="M9.23 7.23h-.5v.5h.5v-.5Zm6.73 1h.5-.5Zm-6.73 1v-.5h-.5v.5h.5Zm-1 6.73v.5-.5Zm-1-6.73h.5v-.5h-.5v.5Zm-1.229 0h-.5v.5h.5v-.5Zm0-2v-.5h-.5v.5h.5Zm1.23 0v.5h.5v-.5h-.5Zm0-1.02v-.5h-.5v.5h.5Zm2 0h.5v-.5h-.5v.5ZM5.074 9.23v.5h.5v-.5h-.5Zm-3.575 0v.5-.5Zm-1-1H0h.5Zm1-1v-.5.5Zm3.575 0h.5v-.5h-.5v.5ZM8.23.5V0v.5Zm1 4.365v.5h.5v-.5h-.5Zm-2 0h-.5v.5h.5v-.5Zm2 2.365v.5h5.73v-1H9.23v.5Zm5.73 0v.5a.5.5 0 0 1 .5.5h1a1.5 1.5 0 0 0-1.5-1.5v.5Zm1 1h-.5a.5.5 0 0 1-.5.5v1a1.5 1.5 0 0 0 1.5-1.5h-.5Zm-1 1v-.5H9.23v1h5.73v-.5Zm-5.73 0h-.5v5.73h1V9.23h-.5Zm0 5.73h-.5a.5.5 0 0 1-.5.5v1a1.5 1.5 0 0 0 1.5-1.5h-.5Zm-1 1v-.5a.5.5 0 0 1-.5-.5h-1a1.5 1.5 0 0 0 1.5 1.5v-.5Zm-1-1h.5V9.23h-1v5.73h.5Zm0-5.73v-.5H6.001v1h1.23v-.5Zm-1.229 0h.5v-2h-1v2h.5Zm0-2v.5h1.23v-1H6v.5Zm1.23 0h.5V6.21h-1v1.02h.5Zm0-1.02v.5h2v-1h-2v.5Zm2 0h-.5v1.02h1V6.21h-.5ZM5.074 9.23v-.5H1.5v1h3.575v-.5Zm-3.575 0v-.5a.5.5 0 0 1-.5-.5H0a1.5 1.5 0 0 0 1.5 1.5v-.5Zm-1-1H1a.5.5 0 0 1 .5-.5v-1A1.5 1.5 0 0 0 0 8.23h.5Zm1-1v.5h3.575v-1H1.5v.5Zm3.575 0h-.5v2h1v-2h-.5ZM8.23.5V1a.5.5 0 0 1 .5.5h1A1.5 1.5 0 0 0 8.23 0v.5Zm1 1h-.5v3.365h1V1.5h-.5Zm0 3.365v-.5h-2v1h2v-.5Zm-2 0h.5V1.5h-1v3.365h.5Zm0-3.365h.5a.5.5 0 0 1 .5-.5V0a1.5 1.5 0 0 0-1.5 1.5h.5Z"
    />
  </svg>
);

export const IconColsed = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 4.00006L4 20M4 4L20 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const IconColumnSettings = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={20}
    viewBox="0 0 21 20"
    fill="none"
    className={className}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeOpacity={0.8}
      strokeWidth={1.5}
      d="M3.5 13.5c0-.943 0-1.414.293-1.707.293-.293.764-.293 1.707-.293h1c.943 0 1.414 0 1.707.293.293.293.293.764.293 1.707v1c0 .943 0 1.414-.293 1.707-.293.293-.764.293-1.707.293-1.414 0-2.121 0-2.56-.44"
    />
    <path
      stroke="currentColor"
      strokeOpacity={0.8}
      strokeWidth={1.5}
      d="M3.5 6.5c0-1.414 0-2.121.44-2.56.439-.44 1.146-.44 2.56-.44.943 0 1.414 0 1.707.293.293.293.293.764.293 1.707v1c0 .943 0 1.414-.293 1.707-.293.293-.764.293-1.707.293h-1c-.943 0-1.414 0-1.707-.293C3.5 7.914 3.5 7.443 3.5 6.5ZM11.5 13.5c0-.943 0-1.414.293-1.707.293-.293.764-.293 1.707-.293h1c.943 0 1.414 0 1.707.293.293.293.293.764.293 1.707 0 1.414 0 2.121-.44 2.56-.439.44-1.146.44-2.56.44-.943 0-1.414 0-1.707-.293-.293-.293-.293-.764-.293-1.707v-1Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeOpacity={0.8}
      strokeWidth={1.5}
      d="M16.5 6.5c0 .943 0 1.414-.293 1.707-.293.293-.764.293-1.707.293h-1c-.943 0-1.414 0-1.707-.293-.293-.293-.293-.764-.293-1.707v-1c0-.943 0-1.414.293-1.707.293-.293.764-.293 1.707-.293 1.414 0 2.121 0 2.56.44M20 12v1m-8 7c3.771 0 5.657 0 6.828-1.172.654-.653.943-1.528 1.07-2.828M8 20c-3.771 0-5.657 0-6.828-1.172C0 17.657 0 15.771 0 12M8 0C4.229 0 2.343 0 1.172 1.172.518 1.825.229 2.7.102 4M0 8V7"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeOpacity={0.8}
      strokeWidth={1.5}
      d="M12 0c3.771 0 5.657 0 6.828 1.172C20 2.343 20 4.229 20 8"
    />
  </svg>
);

export const IconEye = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path
        d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
  </svg>
);

export const IconEyeClosed = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path
        d="M2.68936 6.70456C2.52619 6.32384 2.08528 6.14747 1.70456 6.31064C1.32384 6.47381 1.14747 6.91472 1.31064 7.29544L2.68936 6.70456ZM15.5872 13.3287L15.3125 12.6308L15.5872 13.3287ZM9.04145 13.7377C9.26736 13.3906 9.16904 12.926 8.82185 12.7001C8.47466 12.4742 8.01008 12.5725 7.78417 12.9197L9.04145 13.7377ZM6.37136 15.091C6.14545 15.4381 6.24377 15.9027 6.59096 16.1286C6.93815 16.3545 7.40273 16.2562 7.62864 15.909L6.37136 15.091ZM22.6894 7.29544C22.8525 6.91472 22.6762 6.47381 22.2954 6.31064C21.9147 6.14747 21.4738 6.32384 21.3106 6.70456L22.6894 7.29544ZM19 11.1288L18.4867 10.582V10.582L19 11.1288ZM19.9697 13.1592C20.2626 13.4521 20.7374 13.4521 21.0303 13.1592C21.3232 12.8663 21.3232 12.3914 21.0303 12.0985L19.9697 13.1592ZM11.25 16.5C11.25 16.9142 11.5858 17.25 12 17.25C12.4142 17.25 12.75 16.9142 12.75 16.5H11.25ZM16.3714 15.909C16.5973 16.2562 17.0619 16.3545 17.409 16.1286C17.7562 15.9027 17.8545 15.4381 17.6286 15.091L16.3714 15.909ZM5.53033 11.6592C5.82322 11.3663 5.82322 10.8914 5.53033 10.5985C5.23744 10.3056 4.76256 10.3056 4.46967 10.5985L5.53033 11.6592ZM2.96967 12.0985C2.67678 12.3914 2.67678 12.8663 2.96967 13.1592C3.26256 13.4521 3.73744 13.4521 4.03033 13.1592L2.96967 12.0985ZM12 13.25C8.77611 13.25 6.46133 11.6446 4.9246 9.98966C4.15645 9.16243 3.59325 8.33284 3.22259 7.71014C3.03769 7.3995 2.90187 7.14232 2.8134 6.96537C2.76919 6.87696 2.73689 6.80875 2.71627 6.76411C2.70597 6.7418 2.69859 6.7254 2.69411 6.71533C2.69187 6.7103 2.69036 6.70684 2.68957 6.70503C2.68917 6.70413 2.68896 6.70363 2.68892 6.70355C2.68891 6.70351 2.68893 6.70357 2.68901 6.70374C2.68904 6.70382 2.68913 6.70403 2.68915 6.70407C2.68925 6.7043 2.68936 6.70456 2 7C1.31064 7.29544 1.31077 7.29575 1.31092 7.29609C1.31098 7.29624 1.31114 7.2966 1.31127 7.2969C1.31152 7.29749 1.31183 7.2982 1.31218 7.299C1.31287 7.30062 1.31376 7.30266 1.31483 7.30512C1.31698 7.31003 1.31988 7.31662 1.32353 7.32483C1.33083 7.34125 1.34115 7.36415 1.35453 7.39311C1.38127 7.45102 1.42026 7.5332 1.47176 7.63619C1.57469 7.84206 1.72794 8.13175 1.93366 8.47736C2.34425 9.16716 2.96855 10.0876 3.8254 11.0103C5.53867 12.8554 8.22389 14.75 12 14.75V13.25ZM15.3125 12.6308C14.3421 13.0128 13.2417 13.25 12 13.25V14.75C13.4382 14.75 14.7246 14.4742 15.8619 14.0266L15.3125 12.6308ZM7.78417 12.9197L6.37136 15.091L7.62864 15.909L9.04145 13.7377L7.78417 12.9197ZM22 7C21.3106 6.70456 21.3107 6.70441 21.3108 6.70427C21.3108 6.70423 21.3108 6.7041 21.3109 6.70402C21.3109 6.70388 21.311 6.70376 21.311 6.70368C21.3111 6.70352 21.3111 6.70349 21.3111 6.7036C21.311 6.7038 21.3107 6.70452 21.3101 6.70576C21.309 6.70823 21.307 6.71275 21.3041 6.71924C21.2983 6.73223 21.2889 6.75309 21.2758 6.78125C21.2495 6.83757 21.2086 6.92295 21.1526 7.03267C21.0406 7.25227 20.869 7.56831 20.6354 7.9432C20.1669 8.69516 19.4563 9.67197 18.4867 10.582L19.5133 11.6757C20.6023 10.6535 21.3917 9.56587 21.9085 8.73646C22.1676 8.32068 22.36 7.9668 22.4889 7.71415C22.5533 7.58775 22.602 7.48643 22.6353 7.41507C22.6519 7.37939 22.6647 7.35118 22.6737 7.33104C22.6782 7.32097 22.6818 7.31292 22.6844 7.30696C22.6857 7.30398 22.6867 7.30153 22.6876 7.2996C22.688 7.29864 22.6883 7.29781 22.6886 7.29712C22.6888 7.29677 22.6889 7.29646 22.689 7.29618C22.6891 7.29604 22.6892 7.29585 22.6892 7.29578C22.6893 7.29561 22.6894 7.29544 22 7ZM18.4867 10.582C17.6277 11.3882 16.5739 12.1343 15.3125 12.6308L15.8619 14.0266C17.3355 13.4466 18.5466 12.583 19.5133 11.6757L18.4867 10.582ZM18.4697 11.6592L19.9697 13.1592L21.0303 12.0985L19.5303 10.5985L18.4697 11.6592ZM11.25 14V16.5H12.75V14H11.25ZM14.9586 13.7377L16.3714 15.909L17.6286 15.091L16.2158 12.9197L14.9586 13.7377ZM4.46967 10.5985L2.96967 12.0985L4.03033 13.1592L5.53033 11.6592L4.46967 10.5985Z"
        fill="currentColor"
      />
    </g>
  </svg>
);

export const IconsSortTop = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7628 3.28854C17.0691 3.18645 17.4063 3.29179 17.6 3.55005L20.6 7.55005C20.8485 7.88142 20.7814 8.35152 20.45 8.60005C20.1186 8.84858 19.6485 8.78142 19.4 8.45005L17.75 6.25005V20C17.75 20.4143 17.4142 20.75 17 20.75C16.5858 20.75 16.25 20.4143 16.25 20V4.00005C16.25 3.67723 16.4566 3.39062 16.7628 3.28854ZM3.25 8.00005C3.25 7.58583 3.58579 7.25005 4 7.25005H13C13.4142 7.25005 13.75 7.58583 13.75 8.00005C13.75 8.41426 13.4142 8.75005 13 8.75005H4C3.58579 8.75005 3.25 8.41426 3.25 8.00005ZM5.25 13C5.25 12.5858 5.58579 12.25 6 12.25H13C13.4142 12.25 13.75 12.5858 13.75 13C13.75 13.4143 13.4142 13.75 13 13.75H6C5.58579 13.75 5.25 13.4143 5.25 13ZM7.25 18C7.25 17.5858 7.58579 17.25 8 17.25H13C13.4142 17.25 13.75 17.5858 13.75 18C13.75 18.4143 13.4142 18.75 13 18.75H8C7.58579 18.75 7.25 18.4143 7.25 18Z"
        fill="currentColor"
      />
    </g>
  </svg>
);

export const IconsSortBto = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <path
        d="M4 16L13 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 11H13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 6L13 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 4L17 20L20 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export const IconBookmark = () => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.7358 9.38644V6.47362C12.7358 3.97195 12.7358 2.7211 11.967 1.94392C11.1982 1.16675 9.96069 1.16675 7.48584 1.16675C5.01097 1.16675 3.77353 1.16675 3.00468 1.94392C2.23584 2.7211 2.23584 3.97195 2.23584 6.47362V9.38644C2.23584 11.1928 2.23584 12.096 2.66407 12.4906C2.8683 12.6788 3.12609 12.7971 3.40071 12.8285C3.97652 12.8944 4.64893 12.2996 5.99377 11.1101C6.58821 10.5844 6.88547 10.3215 7.22935 10.2522C7.39869 10.2181 7.57299 10.2181 7.74233 10.2522C8.08621 10.3215 8.38347 10.5844 8.97789 11.1101C10.3228 12.2996 10.9952 12.8944 11.571 12.8285C11.8456 12.7971 12.1034 12.6788 12.3076 12.4906C12.7358 12.096 12.7358 11.1928 12.7358 9.38644Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M9.23584 3.5H5.73584"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const IconActiveBookmark = () => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.7358 6.47362V9.38644C12.7358 11.1928 12.7358 12.096 12.3076 12.4906C12.1034 12.6788 11.8456 12.7971 11.571 12.8285C10.9952 12.8944 10.3228 12.2996 8.97789 11.1101C8.38347 10.5844 8.08621 10.3215 7.74233 10.2522C7.57299 10.2181 7.39869 10.2181 7.22935 10.2522C6.88547 10.3215 6.58821 10.5844 5.99377 11.1101C4.64893 12.2996 3.97652 12.8944 3.40071 12.8285C3.12609 12.7971 2.8683 12.6788 2.66407 12.4906C2.23584 12.096 2.23584 11.1928 2.23584 9.38644V6.47362C2.23584 3.97195 2.23584 2.7211 3.00468 1.94392C3.77353 1.16675 5.01097 1.16675 7.48584 1.16675C9.96069 1.16675 11.1982 1.16675 11.967 1.94392C12.7358 2.7211 12.7358 3.97195 12.7358 6.47362ZM5.29834 3.50008C5.29834 3.25846 5.49422 3.06258 5.73584 3.06258H9.23584C9.47746 3.06258 9.67334 3.25846 9.67334 3.50008C9.67334 3.7417 9.47746 3.93758 9.23584 3.93758H5.73584C5.49422 3.93758 5.29834 3.7417 5.29834 3.50008Z"
      fill="currentColor"
    />
  </svg>
);

export const IconBookmarks = () => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.09387 6.94975C2.09387 6.06722 2.09387 5.62595 2.16322 5.25839C2.46851 3.64031 3.73418 2.37464 5.35226 2.06935C5.71982 2 6.16109 2 7.04362 2C7.43029 2 7.62363 2 7.80944 2.01738C8.61052 2.09229 9.37039 2.40704 9.98981 2.92051C10.1335 3.03961 10.2702 3.17633 10.5436 3.44975L11.0939 4C11.9097 4.81578 12.3176 5.22367 12.806 5.49543C13.0743 5.64471 13.359 5.7626 13.6543 5.84678C14.1918 6 14.7686 6 15.9223 6H16.296C18.9284 6 20.2445 6 21.1001 6.76946C21.1788 6.84024 21.2537 6.91514 21.3244 6.99383C22.0939 7.84935 22.0939 9.16554 22.0939 11.7979V14C22.0939 17.7712 22.0939 19.6569 20.9223 20.8284C19.7508 22 17.8651 22 14.0939 22H10.0939C6.32263 22 4.43702 22 3.26544 20.8284C2.09387 19.6569 2.09387 17.7712 2.09387 14V6.94975Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M22.0939 12.2626V10.0433C22.0939 8.13729 22.0939 7.18427 21.5081 6.59213C20.9223 6 19.9795 6 18.0939 6C16.2083 6 15.2654 6 14.6797 6.59213C14.0939 7.18427 14.0939 8.13729 14.0939 10.0433V12.2626C14.0939 13.6389 14.0939 14.327 14.4201 14.6277C14.5757 14.7711 14.7722 14.8612 14.9814 14.8851C15.4201 14.9353 15.9324 14.4822 16.9571 13.5759C17.41 13.1753 17.6364 12.975 17.8984 12.9223C18.0275 12.8963 18.1603 12.8963 18.2893 12.9223C18.5513 12.975 18.7778 13.1753 19.2307 13.5759C20.2553 14.4822 20.7676 14.9353 21.2064 14.8851C21.4156 14.8612 21.612 14.7711 21.7676 14.6277C22.0939 14.327 22.0939 13.6389 22.0939 12.2626Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M19.4285 7.78125H16.7618"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

export const IconMaximize = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M12.9999 21.9994C17.055 21.9921 19.1784 21.8926 20.5354 20.5355C21.9999 19.0711 21.9999 16.714 21.9999 12C21.9999 7.28595 21.9999 4.92893 20.5354 3.46447C19.071 2 16.714 2 11.9999 2C7.28587 2 4.92884 2 3.46438 3.46447C2.10734 4.8215 2.00779 6.94493 2.00049 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M12 12L17 7M17 7H13.25M17 7V10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />{" "}
      <path
        d="M2 18C2 16.1144 2 15.1716 2.58579 14.5858C3.17157 14 4.11438 14 6 14C7.88562 14 8.82843 14 9.41421 14.5858C10 15.1716 10 16.1144 10 18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />{" "}
    </g>
  </svg>
);

export const IconMinimize = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    width={24}
    height={24}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M12.9999 21.9994C17.055 21.9921 19.1784 21.8926 20.5354 20.5355C21.9999 19.0711 21.9999 16.714 21.9999 12C21.9999 7.28595 21.9999 4.92893 20.5354 3.46447C19.071 2 16.714 2 11.9999 2C7.28587 2 4.92884 2 3.46438 3.46447C2.10734 4.8215 2.00779 6.94493 2.00049 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M17 7L12 12M12 12H15.75M12 12V8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />{" "}
      <path
        d="M2 18C2 16.1144 2 15.1716 2.58579 14.5858C3.17157 14 4.11438 14 6 14C7.88562 14 8.82843 14 9.41421 14.5858C10 15.1716 10 16.1144 10 18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />{" "}
    </g>
  </svg>
);

export const IconTextField = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={24}
    height={24}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M8.25 15.5C8.25 15.9142 8.58579 16.25 9 16.25C9.41421 16.25 9.75 15.9142 9.75 15.5H8.25ZM11.6643 8.75249L12.1624 8.19186L12.1624 8.19186L11.6643 8.75249ZM11.25 10.425C11.25 10.8392 11.5858 11.175 12 11.175C12.4142 11.175 12.75 10.8392 12.75 10.425H11.25ZM11.7475 8.83575L12.3081 8.33756L12.3081 8.33756L11.7475 8.83575ZM6.33575 8.75249L5.83756 8.19186L5.83756 8.19186L6.33575 8.75249ZM5.25 10.425C5.25 10.8392 5.58579 11.175 6 11.175C6.41421 11.175 6.75 10.8392 6.75 10.425H5.25ZM6.25249 8.83575L5.69186 8.33756L5.69186 8.33756L6.25249 8.83575ZM7 14.75C6.58579 14.75 6.25 15.0858 6.25 15.5C6.25 15.9142 6.58579 16.25 7 16.25V14.75ZM11 16.25C11.4142 16.25 11.75 15.9142 11.75 15.5C11.75 15.0858 11.4142 14.75 11 14.75V16.25ZM7.925 9.25H9V7.75H7.925V9.25ZM9 9.25H10.075V7.75H9V9.25ZM9.75 15.5V8.5H8.25V15.5H9.75ZM10.075 9.25C10.5295 9.25 10.8007 9.25137 10.9965 9.27579C11.1739 9.29792 11.1831 9.3283 11.1661 9.31312L12.1624 8.19186C11.8612 7.92419 11.5109 7.82832 11.1822 7.78733C10.8719 7.74863 10.4905 7.75 10.075 7.75V9.25ZM12.75 10.425C12.75 10.0095 12.7514 9.62806 12.7127 9.31782C12.6717 8.98915 12.5758 8.63878 12.3081 8.33756L11.1869 9.33394C11.1717 9.31686 11.2021 9.32608 11.2242 9.50348C11.2486 9.69931 11.25 9.97047 11.25 10.425H12.75ZM11.1661 9.31312C11.1734 9.31964 11.1804 9.32659 11.1869 9.33394L12.3081 8.33756C12.2625 8.28617 12.2138 8.23752 12.1624 8.19186L11.1661 9.31312ZM7.925 7.75C7.50946 7.75 7.12806 7.74863 6.81782 7.78733C6.48914 7.82832 6.13878 7.92419 5.83756 8.19186L6.83394 9.31312C6.81686 9.3283 6.82608 9.29792 7.00348 9.27579C7.19931 9.25137 7.47047 9.25 7.925 9.25V7.75ZM6.75 10.425C6.75 9.97047 6.75137 9.69931 6.77579 9.50348C6.79792 9.32608 6.8283 9.31686 6.81312 9.33394L5.69186 8.33756C5.42419 8.63878 5.32832 8.98915 5.28733 9.31782C5.24863 9.62806 5.25 10.0095 5.25 10.425H6.75ZM5.83756 8.19186C5.78617 8.23752 5.73752 8.28617 5.69186 8.33756L6.81312 9.33394C6.81965 9.3266 6.8266 9.31965 6.83394 9.31312L5.83756 8.19186ZM7 16.25H11V14.75H7V16.25Z"
        fill="currentColor"
      />{" "}
      <path
        d="M12 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 8.22876 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H12M15 4.00093C18.1143 4.01004 19.7653 4.10848 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.7653 19.8915 18.1143 19.99 15 19.9991"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M15 2V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
    </g>
  </svg>
);

export const SearchDocumentIcon = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2v6h6M11 17a2 2 0 100-4 2 2 0 000 4zM13 17l2 2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconReCall = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12a9 9 0 109-9M3 3v6h6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconPost = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 19V5M5 12l7-7 7 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconUnPost = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5v14M5 12l7 7 7-7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconValidatePost = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 19V5M5 12l7-7 7 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 22h6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const IconValidateUnpost = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5v14M5 12l7 7 7-7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 2h6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const IconDocumentView = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2v6h6M12 18v-6M9 15h6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconCalculate = ({ className }) => (
  <svg
    width={24}
    height={24}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="2"
      width="16"
      height="20"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M8 6h8M8 10h3M8 14h3M8 18h3M13 10h3M13 14h3M13 18h3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const IconBookOpen = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={24}
    height={24}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M20.082 3.01787L20.1081 3.76741L20.082 3.01787ZM16.5 3.48757L16.2849 2.76907V2.76907L16.5 3.48757ZM13.6738 4.80287L13.2982 4.15375L13.2982 4.15375L13.6738 4.80287ZM3.9824 3.07501L3.93639 3.8236L3.9824 3.07501ZM7 3.48757L7.19136 2.76239V2.76239L7 3.48757ZM10.2823 4.87558L9.93167 5.5386L10.2823 4.87558ZM13.6276 20.0694L13.9804 20.7312L13.6276 20.0694ZM17 18.6335L16.8086 17.9083H16.8086L17 18.6335ZM19.9851 18.2229L20.032 18.9715L19.9851 18.2229ZM10.3724 20.0694L10.0196 20.7312H10.0196L10.3724 20.0694ZM7 18.6335L7.19136 17.9083H7.19136L7 18.6335ZM4.01486 18.2229L3.96804 18.9715H3.96804L4.01486 18.2229ZM2.75 16.1437V4.99792H1.25V16.1437H2.75ZM22.75 16.1437V4.93332H21.25V16.1437H22.75ZM20.0559 2.26832C18.9175 2.30798 17.4296 2.42639 16.2849 2.76907L16.7151 4.20606C17.6643 3.92191 18.9892 3.80639 20.1081 3.76741L20.0559 2.26832ZM16.2849 2.76907C15.2899 3.06696 14.1706 3.6488 13.2982 4.15375L14.0495 5.452C14.9 4.95981 15.8949 4.45161 16.7151 4.20606L16.2849 2.76907ZM3.93639 3.8236C4.90238 3.88297 5.99643 3.99842 6.80864 4.21274L7.19136 2.76239C6.23055 2.50885 5.01517 2.38707 4.02841 2.32642L3.93639 3.8236ZM6.80864 4.21274C7.77076 4.46663 8.95486 5.02208 9.93167 5.5386L10.6328 4.21257C9.63736 3.68618 8.32766 3.06224 7.19136 2.76239L6.80864 4.21274ZM13.9804 20.7312C14.9714 20.2029 16.1988 19.6206 17.1914 19.3587L16.8086 17.9083C15.6383 18.2171 14.2827 18.8702 13.2748 19.4075L13.9804 20.7312ZM17.1914 19.3587C17.9943 19.1468 19.0732 19.0314 20.032 18.9715L19.9383 17.4744C18.9582 17.5357 17.7591 17.6575 16.8086 17.9083L17.1914 19.3587ZM10.7252 19.4075C9.71727 18.8702 8.3617 18.2171 7.19136 17.9083L6.80864 19.3587C7.8012 19.6206 9.0286 20.2029 10.0196 20.7312L10.7252 19.4075ZM7.19136 17.9083C6.24092 17.6575 5.04176 17.5357 4.06168 17.4744L3.96804 18.9715C4.9268 19.0314 6.00566 19.1468 6.80864 19.3587L7.19136 17.9083ZM21.25 16.1437C21.25 16.8295 20.6817 17.4279 19.9383 17.4744L20.032 18.9715C21.5062 18.8793 22.75 17.6799 22.75 16.1437H21.25ZM22.75 4.93332C22.75 3.47001 21.5847 2.21507 20.0559 2.26832L20.1081 3.76741C20.7229 3.746 21.25 4.25173 21.25 4.93332H22.75ZM1.25 16.1437C1.25 17.6799 2.49378 18.8793 3.96804 18.9715L4.06168 17.4744C3.31831 17.4279 2.75 16.8295 2.75 16.1437H1.25ZM13.2748 19.4075C12.4825 19.8299 11.5175 19.8299 10.7252 19.4075L10.0196 20.7312C11.2529 21.3886 12.7471 21.3886 13.9804 20.7312L13.2748 19.4075ZM13.2982 4.15375C12.4801 4.62721 11.4617 4.65083 10.6328 4.21257L9.93167 5.5386C11.2239 6.22189 12.791 6.18037 14.0495 5.452L13.2982 4.15375ZM2.75 4.99792C2.75 4.30074 3.30243 3.78463 3.93639 3.8236L4.02841 2.32642C2.47017 2.23065 1.25 3.49877 1.25 4.99792H2.75Z"
        fill="currentColor"
      />{" "}
      <path d="M12 5.854V20.9999" stroke="currentColor" strokeWidth="1.5" />{" "}
      <path
        d="M5 9L9 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M19 9L15 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M5 13L9 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M19 13L15 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
    </g>
  </svg>
);

export const IconBook = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    width={24}
    height={24}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M4 8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.87868C20 3.75736 20 5.17157 20 8V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16V8Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />{" "}
      <path
        d="M19.8978 16H7.89778C6.96781 16 6.50282 16 6.12132 16.1022C5.08604 16.3796 4.2774 17.1883 4 18.2235"
        stroke="currentColor"
        strokeWidth="1.5"
      />{" "}
      <path
        d="M8 7H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M8 10.5H13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M19.5 19H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
    </g>
  </svg>
);

export const IconXsl = ({ className }) => (
<svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={ 20 }
    className={className}
    viewBox="0 0 21 20"
    fill="none"
  >
    <path
      fill="currentColor"
      fillOpacity={0.8}
      d="M18.064 4.722h-4.839a.35.35 0 0 1-.228-.081.26.26 0 0 1-.094-.197V.278a.26.26 0 0 1 .094-.197.35.35 0 0 1 .228-.081.35.35 0 0 1 .229.081.26.26 0 0 1 .094.197v3.889h4.516a.35.35 0 0 1 .228.081.26.26 0 0 1 .095.196.26.26 0 0 1-.095.197.35.35 0 0 1-.228.081Z"
    />
    <path
      stroke="currentColor"
      strokeOpacity={0.8}
      strokeWidth={0.25}
      d="M13.225-.125c.113 0 .225.038.31.111a.386.386 0 0 1 .138.291v3.765h4.391c.113 0 .225.038.31.111a.384.384 0 0 1 .137.291.384.384 0 0 1-.137.291.476.476 0 0 1-.31.113h-4.839a.477.477 0 0 1-.31-.113.385.385 0 0 1-.137-.29V.276c0-.113.052-.217.137-.29a.476.476 0 0 1 .31-.112Z"
    />
    <path
      fill="currentColor"
      fillOpacity={0.8}
      d="M18.064 7.49a.35.35 0 0 1-.228-.08.26.26 0 0 1-.095-.197V4.559L13.091.556H3.549c-.342 0-.67.117-.912.325a1.04 1.04 0 0 0-.378.786V7.12a.26.26 0 0 1-.095.196.35.35 0 0 1-.228.081.35.35 0 0 1-.228-.081.26.26 0 0 1-.094-.196V1.667c0-.442.204-.866.567-1.179A2.104 2.104 0 0 1 3.548 0h9.677c.043 0 .085.007.124.021a.33.33 0 0 1 .105.06l4.838 4.167a.28.28 0 0 1 .07.09c.016.034.025.07.024.106v2.769a.245.245 0 0 1-.024.106.28.28 0 0 1-.07.09.33.33 0 0 1-.105.06.368.368 0 0 1-.123.022Z"
    />
    <path
      stroke="currentColor"
      strokeOpacity={0.8}
      strokeWidth={0.25}
      d="M13.225-.125a.455.455 0 0 1 .31.111l4.838 4.167a.37.37 0 0 1 .138.291v2.769c0 .056-.013.11-.037.16a.403.403 0 0 1-.1.13.492.492 0 0 1-.62 0 .384.384 0 0 1-.137-.29V4.617L13.045.681H3.548c-.314 0-.613.107-.83.295a.915.915 0 0 0-.335.691V7.12a.387.387 0 0 1-.138.292.477.477 0 0 1-.31.111.476.476 0 0 1-.31-.11.386.386 0 0 1-.137-.293V1.667c0-.482.222-.94.61-1.273a2.23 2.23 0 0 1 1.45-.519h9.677Z"
    />
    <path
      fill="currentColor"
      fillOpacity={0.8}
      d="M16.451 20H3.548a2.104 2.104 0 0 1-1.368-.488c-.363-.313-.567-.737-.567-1.179v-4.166a.26.26 0 0 1 .094-.197.351.351 0 0 1 .228-.081c.086 0 .168.03.228.081a.26.26 0 0 1 .095.197v4.166c0 .295.136.578.378.786.242.208.57.325.912.325h12.903c.342 0 .67-.117.912.325a1.04 1.04 0 0 0 .378-.786v-4.166a.26.26 0 0 1 .095-.197.351.351 0 0 1 .228-.081c.085 0 .168.03.228.081a.26.26 0 0 1 .094.197v4.166c0 .442-.203.866-.566 1.179A2.104 2.104 0 0 1 16.45 20Z"
    />
    <path
      stroke="currentColor"
      strokeOpacity={0.8}
      strokeWidth={0.25}
      d="M18.064 13.764c.113 0 .225.038.31.111a.385.385 0 0 1 .137.291v4.167c0 .482-.222.94-.61 1.274a2.23 2.23 0 0 1-1.45.518H3.548a2.23 2.23 0 0 1-1.45-.518c-.388-.334-.61-.792-.61-1.274v-4.167c0-.113.052-.217.137-.29a.476.476 0 0 1 .31-.112c.113 0 .225.038.31.111a.386.386 0 0 1 .138.291v4.167c0 .255.117.505.334.692.218.187.517.295.831.295h12.903c.314 0 .613-.108.83-.295a.916.916 0 0 0 .336-.692v-4.167c0-.113.052-.217.137-.29a.476.476 0 0 1 .31-.112Z"
    />
    <path
      fill="currentColor"
      fillOpacity={0.8}
      d="M14.838 14.444H5.161a.35.35 0 0 1-.228-.08.26.26 0 0 1-.095-.197.26.26 0 0 1 .095-.197.351.351 0 0 1 .228-.081h9.677a.35.35 0 0 1 .228.081.26.26 0 0 1 .095.197.26.26 0 0 1-.095.196.35.35 0 0 1-.228.081Z"
    />
    <path
      stroke="currentColor"
      strokeOpacity={0.8}
      strokeWidth={0.25}
      d="M14.838 13.764c.113 0 .225.038.31.111a.385.385 0 0 1 .138.291.386.386 0 0 1-.138.292.475.475 0 0 1-.31.111H5.161a.476.476 0 0 1-.31-.11.386.386 0 0 1-.138-.293c0-.113.053-.217.138-.29a.476.476 0 0 1 .31-.112h9.677Z"
    />
    <path
      fill="currentColor"
      fillOpacity={0.8}
      d="M10 17.222H5.16a.35.35 0 0 1-.227-.081.26.26 0 0 1-.095-.197.26.26 0 0 1 .095-.196.35.35 0 0 1 .228-.081h4.838a.35.35 0 0 1 .229.081.26.26 0 0 1 .094.196.26.26 0 0 1-.094.197.35.35 0 0 1-.229.081Z"
    />
    <path
      stroke="currentColor"
      strokeOpacity={0.8}
      strokeWidth={0.25}
      d="M10 16.542c.113 0 .224.038.31.111a.386.386 0 0 1 .137.291.386.386 0 0 1-.138.292.476.476 0 0 1-.31.111H5.162a.476.476 0 0 1-.31-.111.386.386 0 0 1-.138-.292c0-.113.053-.217.138-.291a.476.476 0 0 1 .31-.111H10Z"
    />
    <path
      fill="currentColor"
      fillOpacity={0.8}
      d="M18.064 14.445H1.935a2.105 2.105 0 0 1-1.368-.488C.204 13.644 0 13.22 0 12.778V8.51c0-.442.204-.866.567-1.179a2.104 2.104 0 0 1 1.368-.488h.013l16.129.092c.51.004.999.182 1.359.494s.563.733.564 1.173v4.176c0 .22-.05.436-.147.638-.098.202-.24.386-.42.54-.18.156-.393.278-.628.362a2.207 2.207 0 0 1-.741.127ZM1.935 7.399c-.342 0-.67.117-.912.325a1.04 1.04 0 0 0-.378.786v4.268c0 .295.136.577.378.786.242.208.57.325.912.325h16.129c.342 0 .67-.117.912-.325.242-.209.378-.491.378-.786V8.602a1.042 1.042 0 0 0-.376-.782 1.405 1.405 0 0 0-.906-.33L1.943 7.4h-.008Z"
    />
    <path
      fill="currentColor"
      strokeOpacity={0.8}
      strokeWidth={0.25}
      d="m1.95 6.718 16.127.092h.001a2.233 2.233 0 0 1 1.44.524c.384.334.605.789.607 1.268v4.176c0 .238-.052.47-.16.69-.107.22-.266.422-.464.59-.199.167-.428.3-.68.39-.253.088-.518.136-.785.143l-16.127-.091a2.232 2.232 0 0 1-1.44-.523 2.222 2.222 0 0 1-.607-1.27v-4.176c0-.238.052-.47.16-.69.108-.22.266-.421.464-.59.199-.166.429-.3.68-.389.254-.088.519-.136.785-.143Z"
    />
    <path
      fill="currentColor"
      fillOpacity={0.8}
      d="M6.931 12H4.696V9.038h2.213v.44H5.316v.803h1.28v.43h-1.28v.828h1.613l.002.46Z"
    />
    <path
      stroke="#212227"
      strokeOpacity={0.8}
      strokeWidth={0.25}
      d="M7.034 8.913v.69H5.44v.553h1.28v.68h-1.28v.579h1.612v.124l.003.46.001.126H4.571V8.913h2.463Z"
    />
    <path
      fill="#212227"
      fillOpacity={0.8}
      d="M9.366 12h-.657L8.17 11.2 7.582 12h-.495l.848-1.129-.733-1.063h.658l.418.645.476-.645h.481l-.72.95L9.367 12Z"
    />
    <path
      stroke="#212227"
      strokeOpacity={0.8}
      strokeWidth={0.25}
      d="m7.927 9.683.037.057.32.493.369-.5.038-.05h.796l-.153.2-.665.88.8 1.166.134.195h-.96l-.037-.054-.44-.652-.484.656-.037.05h-.808l.15-.2.794-1.056-.682-.989-.136-.196h.964Z"
    />
    <path
      fill="#212227"
      fillOpacity={0.8}
      d="m11.122 11.195.494.043c-.064.275-.187.479-.37.611a1.106 1.106 0 0 1-.666.196c-.351 0-.621-.11-.81-.333a1.201 1.201 0 0 1-.283-.81c0-.33.103-.603.31-.819.099-.105.225-.19.368-.245.144-.056.3-.083.458-.078.554 0 .884.252.99.755l-.494.058c-.043-.272-.199-.408-.467-.408a.502.502 0 0 0-.251.056.41.41 0 0 0-.173.167 1.015 1.015 0 0 0-.132.532c0 .223.046.393.137.513.04.057.097.103.165.135a.493.493 0 0 0 .222.045c.253-.002.42-.14.502-.418Z"
    />
    <path
      stroke="#212227"
      strokeOpacity={0.8}
      strokeWidth={0.25}
      d="M10.22 10.92c0 .156.025.273.066.36l.046.077.003.004a.29.29 0 0 0 .116.094.37.37 0 0 0 .166.033h.003a.355.355 0 0 0 .235-.076c.06-.05.111-.13.147-.252l.029-.099.102.01.494.043.144.012-.033.14c-.07.297-.205.53-.418.685h-.002a1.23 1.23 0 0 1-.737.218v.001h-.004c-.379-.001-.686-.121-.903-.377v-.002a1.326 1.326 0 0 1-.312-.894c0-.357.113-.66.344-.9.112-.12.254-.213.414-.276.16-.062.333-.091.507-.086l-.002.001c.295 0 .544.066.737.213.194.148.316.366.374.64l.027.134-.136.016-.494.059-.119.013-.018-.119c-.019-.116-.059-.187-.108-.23-.049-.043-.123-.071-.235-.072h-.005a.38.38 0 0 0-.19.042.284.284 0 0 0-.12.115v.002l-.11-.062.108.062a.893.893 0 0 0-.116.467l.001.004Z"
    />
    <path
      fill="#212227"
      fillOpacity={0.8}
      d="m13.677 11.301.516.06a.947.947 0 0 1-.393.491c-.212.134-.47.202-.733.194-.353 0-.637-.102-.852-.306-.215-.204-.322-.48-.322-.83 0-.33.107-.604.322-.822.215-.217.51-.325.882-.325.363 0 .643.107.839.321.196.214.295.489.297.825v.055h-1.742c-.005.12.012.242.049.358a.491.491 0 0 0 .193.235.634.634 0 0 0 .365.1c.286 0 .479-.118.579-.356Zm-.035-.655a.509.509 0 0 0-.166-.39.564.564 0 0 0-.18-.109.631.631 0 0 0-.617.1.587.587 0 0 0-.186.396l1.149.003Z"
    />
    <path
      stroke="#212227"
      strokeOpacity={0.8}
      strokeWidth={0.25}
      d="M13.078 10.232c-.06-.001-.119.009-.174.028a.448.448 0 0 0-.142.08.487.487 0 0 0-.116.178l.852.002a.405.405 0 0 0-.105-.171l-.065-.048a.511.511 0 0 0-.25-.07Zm1.28.857h-1.736a.939.939 0 0 0 .037.195.369.369 0 0 0 .143.168.51.51 0 0 0 .293.08h.004a.55.55 0 0 0 .293-.07.433.433 0 0 0 .17-.21l.037-.086.092.011.517.06.152.018-.048.147c-.076.225-.233.42-.444.555v.001a1.43 1.43 0 0 1-.802.212c-.378 0-.695-.11-.937-.34-.244-.232-.361-.543-.361-.92 0-.36.118-.667.358-.91.243-.245.572-.362.97-.362.39 0 .707.115.932.361.22.24.328.547.33.908v.182Z"
    />
    <path
      fill="#212227"
      fillOpacity={0.8}
      d="M15.336 12h-.575V9.038h.575V12Z"
    />
    <path
      stroke="#212227"
      strokeOpacity={0.8}
      strokeWidth={0.25}
      d="M15.46 8.913v3.212h-.824V8.913h.825Z"
    />
  </svg>
);

export const IconDocument = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M18.18 8.03933L18.6435 7.57589C19.4113 6.80804 20.6563 6.80804 21.4241 7.57589C22.192 8.34374 22.192 9.58868 21.4241 10.3565L20.9607 10.82M18.18 8.03933C18.18 8.03933 18.238 9.02414 19.1069 9.89309C19.9759 10.762 20.9607 10.82 20.9607 10.82M18.18 8.03933L13.9194 12.2999C13.6308 12.5885 13.4865 12.7328 13.3624 12.8919C13.2161 13.0796 13.0906 13.2827 12.9882 13.4975C12.9014 13.6797 12.8368 13.8732 12.7078 14.2604L12.2946 15.5L12.1609 15.901M20.9607 10.82L16.7001 15.0806C16.4115 15.3692 16.2672 15.5135 16.1081 15.6376C15.9204 15.7839 15.7173 15.9094 15.5025 16.0118C15.3203 16.0986 15.1268 16.1632 14.7396 16.2922L13.5 16.7054L13.099 16.8391M13.099 16.8391L12.6979 16.9728C12.5074 17.0363 12.2973 16.9867 12.1553 16.8447C12.0133 16.7027 11.9637 16.4926 12.0272 16.3021L12.1609 15.901M13.099 16.8391L12.1609 15.901"
        stroke="currentColor"
        strokeWidth="1.5"
      />{" "}
      <path
        d="M8 13H10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M8 9H14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M8 17H9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M19.8284 3.17157C18.6569 2 16.7712 2 13 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C20.7715 19.8853 20.9554 18.4796 20.9913 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
    </g>
  </svg>
);

export const IconAttachments = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M18 10L13 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />{" "}
      <path
        d="M10 3H16.5C16.9644 3 17.1966 3 17.3916 3.02567C18.7378 3.2029 19.7971 4.26222 19.9743 5.60842C20 5.80337 20 6.03558 20 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />{" "}
      <path
        d="M2 6.94975C2 6.06722 2 5.62595 2.06935 5.25839C2.37464 3.64031 3.64031 2.37464 5.25839 2.06935C5.62595 2 6.06722 2 6.94975 2C7.33642 2 7.52976 2 7.71557 2.01738C8.51665 2.09229 9.27652 2.40704 9.89594 2.92051C10.0396 3.03961 10.1763 3.17633 10.4497 3.44975L11 4C11.8158 4.81578 12.2237 5.22367 12.7121 5.49543C12.9804 5.64471 13.2651 5.7626 13.5604 5.84678C14.0979 6 14.6747 6 15.8284 6H16.2021C18.8345 6 20.1506 6 21.0062 6.76946C21.0849 6.84024 21.1598 6.91514 21.2305 6.99383C22 7.84935 22 9.16554 22 11.7979V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V6.94975Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />{" "}
    </g>
  </svg>
);

export const IconWorkflow = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      {" "}
      <defs>
        {" "}
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".cls-1{fill:none;stroke:currentColor;strokeLinecap:round;strokeLinejoin:round;strokeWidth:1.5px;}",
          }}
        />{" "}
      </defs>{" "}
      <g id="ic-statistics-workflow">
        {" "}
        <circle className="cls-1" cx={12} cy={6} r={3} />{" "}
        <rect className="cls-1" x={2} y={16} width={8} height={5} rx={2} />{" "}
        <rect className="cls-1" x={14} y={16} width={8} height={5} rx={2} />{" "}
        <path className="cls-1" d="M6,16V14a2,2,0,0,1,2-2h8a2,2,0,0,1,2,2v2" />{" "}
        <line className="cls-1" x1={12} y1={9} x2={12} y2={12} />{" "}
      </g>{" "}
    </g>
  </svg>
);

export const IconGridSort = ({ className }) => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path
      fill="#97959D"
      d="M4.151 7.333h7.698c.575 0 .88-.68.498-1.11l-3.849-4.33a.665.665 0 0 0-.996 0l-3.85 4.33a.667.667 0 0 0 .5 1.11Zm3.35 6.773a.664.664 0 0 0 .997 0l3.849-4.33a.666.666 0 0 0-.498-1.11H4.15c-.575 0-.88.68-.498 1.11l3.849 4.33Z"
    />
  </svg>
);

export const IconGridMore = ({ className }) => (
      <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={ 20 }
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <g
      fill="#fff"
      stroke="#97959D"
      strokeLinecap="round"
      strokeLinejoin="bevel"
      strokeWidth={1.5}
      clipPath="url(#a)"
    >
      <path d="M10.018 5.238a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334ZM9.982 11.745a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334ZM10.018 18.252a1.667 1.667 0 1 0 0-3.334 1.667 1.667 0 0 0 0 3.334Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
)

export const IconBack = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    className={className}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m3.75 10 4.167-4.167M3.75 10l4.167 4.166M3.75 10h5.417m2.916 0c1.39 0 4.167.833 4.167 4.166"
    />
  </svg>
);
