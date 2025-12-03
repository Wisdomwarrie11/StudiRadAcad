import React from 'react';

const stats = [
  { value: "5000", label: "Active Learners", suffix: "+" },
  { value: "120", label: "Partner Hospitals", suffix: "+" },
  { value: "50", label: "Expert Courses", suffix: "" },
  { value: "95", label: "Career Placement", suffix: "%" },
];

const Stats: React.FC = () => {
  return (
    <div className="relative -mt-16 z-20 container mx-auto px-4 md:px-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-100">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-5xl font-extrabold text-brand-primary mb-2">
              {stat.value}{stat.suffix}
            </div>
            <p className="text-gray-500 font-medium text-sm md:text-base uppercase tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;