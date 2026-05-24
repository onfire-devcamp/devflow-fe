import { useAuthStore } from '../../auth/stores/authStore';

const ProfileCard = () => {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.username ?? 'Guest';
  const initials =
    displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'G';

  return (
    <div className="border border-[var(--color-primary-mid)] rounded-[24px] p-5 md:p-8 shadow-sm bg-white w-full flex items-center">
      <div className="w-[62px] h-[62px] rounded-2xl bg-gradient-to-br from-fuchsia-400 to-violet-400 flex items-center justify-center text-white text-[28px] font-semibold">
        {initials}
      </div>

      <div className="ml-5">
        <h2 className="text-[36px] font-semibold text-[#2F2F3A]">
          {displayName}
        </h2>

        <div className="flex items-center mt-3 text-sm text-gray-400">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-orange-700 font-medium">
            <span>0-day streak</span>
          </div>

          <span className="mx-3 text-gray-300">·</span>

          <span>0 tasks completed</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
