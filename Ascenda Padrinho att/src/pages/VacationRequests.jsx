import React from "react";
import { motion } from "framer-motion";
import VacationRequestsPanel from "../components/vacation/VacationRequestsPanel";

export default function VacationRequests() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Vacation Requests
          </h1>
          <p className="text-muted">Review and manage intern vacation requests</p>
        </motion.div>

        <VacationRequestsPanel />
      </div>
    </div>
  );
}