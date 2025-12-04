import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const audiences = [
  {
    title: "Students",
    description: "Access structured radiography courses, opportunities, and mentorship to build a solid career foundation.",
    image: "students.jpeg",
    features: ["Exam Prep", "Mentorship", "Basics"]
  },
  {
    title: "Professionals",
    description: "Stay updated with the latest techniques, collaborate with peers worldwide, and earn certifications that advance your career.",
    image: "nurse.jpeg",
    features: ["CPD Points", "Networking", "Advanced"]
  },
  {
    title: "Institutes",
    description: "Integrate StudiRad into your curriculum to provide standardized radiography training, research support, and student engagement.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
    features: ["Curriculum", "Analytics", "Support"]
  },
  {
    title: "Teachers",
    description: "Enhance your teaching with digital radiographs, case libraries, and interactive lessons tailored for radiography education.",
    image: "lecturer.jpg",
    features: ["Resources", "Tools", "Library"]
  }
];

const TargetAudience: React.FC = () => {
  return (
    <section className="py-20 bg-brand-dark text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-base font-bold text-brand-accent uppercase tracking-wider mb-2">Community</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Who StudiRad Is Meant For</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A platform designed to connect learners, educators, and professionals across the entire radiography spectrum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((item, index) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl bg-brand-primary/10 border border-white/5 hover:border-brand-accent/50 transition-all duration-300 flex flex-col h-full">
              <div className="h-48 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent opacity-60 z-10"></div>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-brand-accent mb-3">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed flex-1">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  {item.features.map((f, i) => (
                    <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-400 flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-brand-accent" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;