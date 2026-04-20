import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Ayi Effiom",
    role: "Radiographer",
    quote: "StudiRad's mentorship feature connected me with a senior radiographer who guided my application process.",
    avatar: "Ayi.jpg"
  },
  {
    id: 2,
    name: "David Okechukwu",
    role: "Student Radiographer",
    quote: "The weekly quizzes and interactive anatomy tools make studying so much more engaging than textbooks. I aced my board exams thanks to this platform!",
    avatar: "manmed.jpeg"
  },
  {
    id: 3,
    name: "Gloria Ekeata",
    role: "Intern Radiographer",
    quote: "The webinars organized by StudiRad has been a constant source of motivation for me. It keeps me going in this journey. Thank you StudiRad",
    avatar: "Gloria.jpg"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-brand-light">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Trusted by Professionals</h2>
          <p className="text-gray-600">
            See how StudiRad is impacting careers across the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow relative">
              <Quote className="absolute top-6 right-6 text-brand-accent/20" size={48} />
              <div className="flex items-center gap-4 mb-6">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-brand-accent" />
                <div>
                  <h4 className="font-bold text-brand-dark">{t.name}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;