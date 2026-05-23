import React from "react";

const ProfileCard = () => {
  return (
    <div className="w-[900px] h-[128px] rounded-2xl border border-pink-100 bg-white px-6 flex items-center">
      <div className="w-[62px] h-[62px] rounded-2xl bg-gradient-to-br from-fuchsia-400 to-violet-400 flex items-center justify-center text-white text-[28px] font-semibold">
        MH
      </div>

      <div className="ml-5">
        <h2 className="text-[36px] font-semibold text-[#2F2F3A]">
          Minh
        </h2>

        <div className="flex items-center mt-3 text-sm text-gray-400">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-orange-700 font-medium">
            <span>🔥</span>
            <span>6-day streak</span>
          </div>

          <span className="mx-3 text-gray-300">·</span>

          <span>2 tasks completed</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;