import React, { useState, useEffect } from 'react';
import { ThumbsUp, CheckCircle2 } from 'lucide-react';
import { getServiceVotes, voteForPrivateClasses, hasUserVotedPrivateClasses } from '../services/serviceVotes';

export const PrivateClassesSection: React.FC = () => {
  const [votes, setVotes] = useState(194);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    // Check if user already voted across sessions
    hasUserVotedPrivateClasses().then((voted) => {
      if (voted) {
        setHasVoted(true);
      }
    });

    // Load current vote count
    getServiceVotes().then((data) => {
      setVotes(data.privateClassesVotes);
    });
  }, []);

  const handleVote = async () => {
    if (hasVoted || isVoting) return;
    setIsVoting(true);

    try {
      const updatedVotes = await voteForPrivateClasses();
      setVotes(updatedVotes);
      setHasVoted(true);
      setShowThankYou(true);
    } catch (err) {
      setVotes((prev) => prev + 1);
      setHasVoted(true);
      setShowThankYou(true);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <section id="private-classes" className="scroll-mt-24 py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                Coming Soon
              </span>
              <h3 className="text-2xl font-extrabold text-[#002147] tracking-tight">
                Private Classes
              </h3>
              <p className="text-gray-600 text-sm mt-1 max-w-xl">
                Personal one-on-one lessons tailored directly to your course syllabus, difficult topics, or exam preparation.
              </p>
            </div>

            {/* Current Vote Count Display */}
            <div className="bg-blue-50/70 border border-blue-100 px-4 py-3 rounded-xl self-start sm:self-auto text-center sm:text-right">
              <span className="text-xs text-gray-500 font-semibold block">Total Votes</span>
              <span className="text-xl font-extrabold text-[#002147]">{votes} Votes</span>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Focus on Tough Topics</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Spend time on what you find difficult, such as radiation physics, x-ray positioning, CT anatomy, or ultrasound.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Live Image Review</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Interactive screen-sharing sessions where tutors walk you through real scans and image critique.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <h4 className="font-bold text-gray-900 text-sm mb-1">Flexible Schedule</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose class times that fit your hospital shifts, clinical postings, or university timetable.
              </p>
            </div>
          </div>

          {/* Voting Box */}
          <div className="p-6 rounded-xl bg-[#033c51] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold text-white">
                Would you like us to introduce Private Classes?
              </h4>
              <p className="text-xs text-blue-100 mt-1 max-w-md leading-relaxed">
                The higher the votes, the more urgent it is for us to open bookings and assign private tutors.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-center sm:items-end">
              <button
                onClick={handleVote}
                disabled={hasVoted || isVoting}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                  hasVoted
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#f59e0b] hover:bg-[#d97706] text-gray-950 shadow-md'
                }`}
              >
                {hasVoted ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Vote Recorded</span>
                  </>
                ) : (
                  <>
                    <ThumbsUp size={15} />
                    <span>{isVoting ? 'Voting...' : 'Vote for Private Classes'}</span>
                  </>
                )}
              </button>

              {hasVoted && (
                <span className="text-[11px] text-emerald-300 mt-2 font-medium">
                  {showThankYou ? 'Thank you! Your vote has been recorded.' : 'You have already voted.'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivateClassesSection;
