import React from "react";

const skills = [
  {
    title: "FRONTEND",
    items: ["React", "TypeScript", "Tailwind CSS", "React Router"],
  },
  {
    title: "BACKEND",
    items: ["Node.js", "Express", "JWT"],
  },
  {
    title: "DATABASE",
    items: ["PostgreSQL", "Prisma"],
  },
  {
    title: "TOOLS",
    items: ["Vite", "Git", "Postman"],
  },
];

const SkillSection = () => {
  return (
    <div className="w-full px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {skills.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-pink-100 bg-white p-5"
          >
            <h3 className="text-sm font-semibold tracking-wide text-gray-500 mb-5">
              {section.title}
            </h3>

            <div className="flex flex-wrap gap-3">
              {section.items.map((item) => (
                <div
                  key={item}
                  className="
                    px-4
                    py-2
                    rounded-full
                    border
                    border-pink-100
                    bg-pink-50
                    text-gray-700
                    text-sm
                    font-medium
                  "
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillSection;