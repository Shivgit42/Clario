"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is Clario free?",
    answer: "Yes! Clario is completely free with no hidden costs.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Yes, creating an account lets you sync across devices and access your dashboard.",
  },
  {
    question: "How does Clario work?",
    answer:
      "Install the extension, log in once, and start saving bookmarks and notes. Everything syncs instantly.",
  },
  {
    question: "Can I use folders?",
    answer: "Absolutely. Create and manage folders right from your dashboard.",
  },
  {
    question: "Is my data private?",
    answer:
      "Your data stays private, securely stored, and only accessible to you.",
  },
  {
    question: "Which browsers are supported?",
    answer: "Currently, Clario supports Chromium-based browsers.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const contentVariants = {
    hidden: { opacity: 0, y: -8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" as const, delay: 0.05 },
    },
    exit: {
      opacity: 0,
      y: -8,
      transition: { duration: 0.2, ease: "easeIn" as const },
    },
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <h2 className="text-3xl sm:text-5xl font-bold text-center mb-10">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-lg border transition-colors shadow-sm 
                ${
                  isOpen
                    ? "border-l-4 border-l-[#ddba0e] border-gray-200 dark:border-gray-700"
                    : "border border-gray-200 dark:border-gray-700"
                }
              `}
            >
              <div
                className="flex justify-between items-center cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-[#202020] rounded-lg"
                onClick={() => toggle(i)}
              >
                <h3 className="font-medium">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    variants={contentVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
