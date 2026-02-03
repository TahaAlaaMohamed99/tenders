import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  IconLanguage, 
  IconDark, 
  IconLight, 
  IconNotification, 
  IconLogout
} from "../assets/Icons";
import { toggleTheme, setCurrentLanguage } from "../store/Reducers/Layout/themeSlice";
import CustomBtn from "./CustomBtn";
import ActionModal from "./ActionModal";
import UserAvatar from "./UserAvatar";
import LanguageSelector from "./HeaderParts/LanguageSelector";
import ProfileMenu from "./HeaderParts/ProfileMenu";
import ConfirmationModal from "./ConfirmationModal";
import TranslationText from "./TranslationText";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Header Component
 * 
 * Top navigation bar containing:
 * - Dynamic Page Title (from Redux)
 * - Global Actions (Language, Theme, Notifications)
 * - User Profile
 * 
 * Follows SOLID principles by segregating modal content into separate components.
 */
export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // State Selectors
  const breadcrumbs = useSelector((state) => state.breadcrumbsSlice.breadcrumbs);
  const { theme, currentLanguage } = useSelector((state) => state.themeSlice);

  // Refs for Dropdown Positioning
  const languageBtnRef = useRef(null);
  const profileBtnRef = useRef(null);

  // Local UI State
  const [activeModal, setActiveModal] = useState(null); // 'language', 'profile', or null

  // Handlers
  const handleToggleModal = (modalName) => {
    setActiveModal((prev) => (prev === modalName ? null : modalName));
  };

  const closeModal = () => setActiveModal(null);

  const handleThemeToggle = () => {
    dispatch(toggleTheme(theme === "dark" ? "light" : "dark"));
  };

  const handleLanguageSelect = (lang) => {
    dispatch(setCurrentLanguage(lang));
    closeModal();
  };

  const handleLogout = () => {
    setActiveModal("logout_confirm");
  };

  const handleConfirmLogout = () => {
    logout();
    setActiveModal(null);
    navigate('/login');
  };

  return (
    <>
        <header className="flex justify-between items-center h-[80px] w-full transition-all duration-300">
            {/* Left Side: Dynamic Title */}
            <div className="flex items-center ms-4">
                <h1 className="text-2xl font-bold text-titleColor dark:text-titleColorDark transition-colors">
                  <TranslationText 
                    page="Sidebar" 
                    title={breadcrumbs.pageTitle || "Dashboard"} 
                  />
                </h1>
            </div>

            {/* Right Side: Actions Group */}
            <div className="flex items-center gap-2">
                
                {/* Visual Separator */}
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-2" />

                {/* Language Toggle */}
                <div ref={languageBtnRef} className="bg-white dark:bg-bgWhiteDark rounded-2xl w-10 h-10 flex items-center justify-center shadow-sm">
                    <CustomBtn 
                        onClick={() => handleToggleModal("language")}
                        size=""
                        className="text-textColor dark:text-textColorDark hover:text-primary transition-colors !min-w-0 !p-0 w-full h-full justify-center"
                        icon={<IconLanguage className="w-5 h-5" />}
                    />
                </div>

                {/* Theme Toggle */}
                <div className="bg-white dark:bg-bgWhiteDark rounded-2xl w-10 h-10 flex items-center justify-center shadow-sm">
                    <CustomBtn 
                        onClick={handleThemeToggle}
                        size=""
                        className="text-textColor dark:text-textColorDark hover:text-primary transition-colors !min-w-0 !p-0 w-full h-full justify-center"
                        icon={theme === "dark" ? <IconLight className="w-5 h-5" /> : <IconDark className="w-5 h-5" />}
                    />
                </div>

                {/* Notification - Placeholder for future logic */}
                <div className="bg-white dark:bg-bgWhiteDark rounded-2xl w-10 h-10 flex items-center justify-center shadow-sm">
                    <CustomBtn 
                        onClick={() => {}} // TODO: Implement Notifications
                        size=""
                        className="text-textColor dark:text-textColorDark hover:text-primary transition-colors relative !min-w-0 !p-0 w-full h-full justify-center"
                        icon={
                            <div className="relative">
                                <IconNotification className="w-5 h-5" />
                                <span className="absolute top-0 right-1 w-2 h-2 bg-error rounded-full border border-white dark:border-bgWhiteDark animate-pulse" />
                            </div>
                        }
                    />
                </div>

                {/* User Profile */}
                <div ref={profileBtnRef} className="ms-2">
                    <UserAvatar onClick={() => handleToggleModal("profile")} />
                </div>
            </div>
        </header>

        {/* --- Drodown Modals --- */}

        {/* Language Dropdown */}
        <ActionModal 
            isOpen={activeModal === "language"} 
            onClose={closeModal} 
            mode="dropdown"
            triggerRef={languageBtnRef}
            position="bottom-end"
        >
            <LanguageSelector 
                currentLanguage={currentLanguage} 
                onSelect={handleLanguageSelect} 
            />
        </ActionModal>

        {/* Profile Dropdown */}
        <ActionModal 
            isOpen={activeModal === "profile"} 
            onClose={closeModal} 
            mode="dropdown"
            triggerRef={profileBtnRef}
            position="bottom-end"
        >
            <ProfileMenu 
                onLogout={handleLogout}
                user={{ name: "Admin User", email: "admin@example.com" }} 
            />
        </ActionModal>

        {/* Logout Confirmation Modal */}
        <ConfirmationModal
            isVisible={activeModal === "logout_confirm"}
            onCancel={() => setActiveModal(null)}
            onConfirm={handleConfirmLogout}
            title="logout"
            subTitle=""
            description="areYouSureYouWantToLogout"
            type="delete" // Red branding for logout usually, or 'primary'
            confirmButtonLabel="logout"
            cancelButtonLabel="cancel"
            icon={<IconLogout className="w-12 h-12" />} 
            ResourcePage="General"
        />
    </>
  );
}
