import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { motion } from 'framer-motion';


interface CategoryStudySetsModalProps {
  open: boolean;
  category: any;
  studySets: any[];
  loading: boolean;
  onClose: () => void;
  onViewStudySet: (id: string) => void;
  onCreateStudySet: (categoryId: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const CategoryStudySetsModal: React.FC<CategoryStudySetsModalProps> = ({
  open,
  category,
  studySets,
  loading,
  onClose,
  onViewStudySet,
  onCreateStudySet,
}) => {
  if (!open || !category) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative ">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="text-2xl">&times;</span>
        </button>
        <h3 className="text-xl font-bold mb-4">
          Study Sets in "{category.name}"
        </h3>
        {loading ? (
          <div className="text-gray-400 text-center py-8">
            Loading study sets...
          </div>
        ) : studySets.length ? (
          <motion.div 
            className="space-y-4 mb-4 max-h-[50vh] overflow-y-auto"
            variants={container}
            initial="hidden"
            animate="show"
          >          
            {studySets.map((ss, index) => (
              <motion.div
                key={ss.id}
                variants={item as any}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition flex flex-col cursor-pointer"
                onClick={() => {
                  onClose();
                  onViewStudySet(ss.id);
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <motion.span 
                    className="text-lg font-bold text-blue-800 line-clamp-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {ss.title}
                  </motion.span>
                  <motion.span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ml-2 ${
                      ss.level === "BEGINNER"
                        ? "bg-green-100 text-green-700"
                        : ss.level === "INTERMEDIATE"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {ss.level}
                  </motion.span>
                  {ss.isPublic ? (
                    <motion.span 
                      className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      Public
                    </motion.span>
                  ) : (
                    <motion.span 
                      className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-gray-600 text-xs font-medium"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      Private
                    </motion.span>
                  )}
                </div>
                <motion.div 
                  className="flex items-center text-sm text-gray-600 mb-1 space-x-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {ss.vocabularyCount} terms
                  </span>
                  <span className="flex items-center">
                    <span className="mr-1">{ss.likesCount}</span>
                    <motion.span 
                      role="img" 
                      aria-label="likes"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      ❤️
                    </motion.span>
                  </span>
                  <span className="text-xs text-gray-400">
                    {ss.createdAt
                      ? new Date(ss.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </motion.div>
                {ss.tags && ss.tags.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-1 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {ss.tags.map((tag: string, idx: number) => (
                      <motion.span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (index * 0.1 + 0.6) + (idx * 0.05) }}
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
         
          </motion.div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            No study sets in this category.
          </div>
        )}
        {category && (
          <button
            className="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-base"
            onClick={() => onCreateStudySet(category.id)}
          >
            + Create Study Set
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryStudySetsModal; 