export default function Loading({ color = "bg-gray-500" }) {
  const blades = Array.from({ length: 12 });

  return (
    <div className="flex items-center justify-center w-full py-10">
      <div className="relative w-20 h-20">
        {blades.map((_, i) => {
          const angle = i * 30; // 360 / 12 blades
          const delay = i * 0.083; // staggered delay like original

          return (
            <div
              key={i}
              className={`absolute w-[0.18rem] h-[0.7rem] rounded-full ${color}`}
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${angle}deg) translate(0, -45%)`,
                transformOrigin: "center -0.35rem",
                animation: `spinnerFade 1s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes spinnerFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
