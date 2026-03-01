import TranslationText from "../TranslationText";

/**
 * ProfileMenu Component
 * Renders the user profile details and actions.
 * 
 * @param {Object} props
 * @param {Object} props.user - User object (name, email, image)
 * @param {Function} props.onLogout - generic logout handler
 */
export default function ProfileMenu({ user, onLogout }) {
  return (
    <>
        <div className="flex items-center mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600 me-3">
                <img 
                    src={user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"} 
                    alt="User"
                    className="w-full h-full object-cover" 
                />
            </div>
            <div>
                <h4 className="text-sm font-bold">{user?.name || "Admin User"}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || "admin@example.com"}</p>
            </div>
        </div>
        
        <div className="space-y-1">
            <button className="w-full px-3 py-2 rounded-lg text-start text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <TranslationText title="AccountSettings" page="General" />
            </button>
            {/* <button 
                onClick={onLogout}
                className="w-full px-3 py-2 rounded-lg text-start text-sm hover:bg-error/10 text-error transition-colors"
            >
                <TranslationText title="logout" page="General" />
            </button> */}
        </div>
    </>
  );
}
