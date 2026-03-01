/**
 * UserAvatar Component
 * Displays the user's profile image or initials with a consistent style.
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Click handler
 * @param {string} [props.imageUrl] - URL for the avatar image
 * @param {string} [props.className] - Additional classes
 */
export default function UserAvatar({ onClick, imageUrl, className = "" }) {
  return (
    <button 
      onClick={onClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white overflow-hidden hover:opacity-90 transition-opacity border-2 border-transparent hover:border-borderColor ${className}`}
      aria-label="User Menu"
    >
      <img 
          src={imageUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"} 
          alt="User"
          className="w-full h-full object-cover" 
      />
    </button>
  );
}
