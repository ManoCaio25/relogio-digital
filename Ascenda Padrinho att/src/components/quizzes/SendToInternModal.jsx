import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { interns } from "@/data/interns";
import { Button } from "@/components/ui/button";

export function SendToInternModal({ open, initialSelected = [], onClose, onSave }) {
  const [selected, setSelected] = React.useState(initialSelected);

  React.useEffect(() => {
    if (open) {
      setSelected(initialSelected);
    }
  }, [open, initialSelected]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    onSave(selected);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] grid place-items-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-surface p-5 shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Send quiz to intern</h3>
              <p className="text-sm text-muted-foreground">
                Select one or more interns to receive this quiz.
              </p>
            </div>

            <div className="mb-4 max-h-60 space-y-2 overflow-y-auto pr-1">
              {interns.map((intern) => (
                <label
                  key={intern.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border border-border/60 bg-surface/80 px-3 py-2 text-sm transition hover:border-primary/60 ${
                    selected.includes(intern.id) ? "border-primary/70 bg-primary/10" : ""
                  }`}
                >
                  <span>{intern.name}</span>
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selected.includes(intern.id)}
                    onChange={() => toggle(intern.id)}
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-500 text-white hover:bg-blue-500/90">
                Send quiz
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
