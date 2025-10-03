import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Intern } from "@/entities/Intern";
import { CourseAssignment } from "@/entities/CourseAssignment";
import { Notification } from "@/entities/Notification";
import { User } from "@/entities/User";
import { Loader2, UserPlus, Calendar } from "lucide-react";
import Avatar from "../ui/Avatar";
import { eventBus, EventTypes } from "../utils/eventBus";
import { useTranslation } from "@/i18n";

export default function AssignCourseModal({ course, isOpen, onClose, onSuccess }) {
  const [interns, setInterns] = useState([]);
  const [selectedInterns, setSelectedInterns] = useState(new Set());
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      const [internsData, userData] = await Promise.all([
        Intern.filter({ status: 'active' }),
        User.me().catch(() => null)
      ]);
      setInterns(internsData);
      setUser(userData);
    };
    
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const toggleIntern = useCallback((internId) => {
    setSelectedInterns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(internId)) {
        newSet.delete(internId);
      } else {
        newSet.add(internId);
      }
      return newSet;
    });
  }, []);

  const handleAssign = useCallback(async (e) => {
    e.preventDefault();
    if (selectedInterns.size === 0 || !course) return;

    setIsAssigning(true);
    try {
      const assignments = [];
      const now = new Date().toISOString();

      for (const internId of selectedInterns) {
        const assignment = await CourseAssignment.create({
          course_id: course.id,
          intern_id: internId,
          assigned_by: user?.email || 'manager',
          status: 'assigned',
          progress: 0,
          assigned_date: now,
          due_date: dueDate || null,
          notes: notes || null
        });
        assignments.push(assignment);

        const intern = interns.find(i => i.id === internId);
        await Notification.create({
          type: 'course_assigned',
          title: 'New Course Assigned',
          body: `"${course.title}" has been assigned to ${intern?.full_name || 'intern'}`,
          target_id: course.id,
          target_kind: 'course',
          actor_name: user?.full_name || 'Manager'
        });
      }

      eventBus.emit(EventTypes.COURSE_ASSIGNED, {
        courseId: course.id,
        internIds: Array.from(selectedInterns),
        assignments
      });

      onSuccess?.();
      onClose();
      
      setSelectedInterns(new Set());
      setDueDate("");
      setNotes("");
    } catch (error) {
      console.error("Error assigning course:", error);
    }
    setIsAssigning(false);
  }, [selectedInterns, course, dueDate, notes, user, interns, onSuccess, onClose]);

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-surface border-border text-primary max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand" />
            {t("assignModal.title", { course: course.title })}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAssign} className="space-y-6">
          <div>
            <Label className="text-secondary mb-3 block">{t("assignModal.selectInterns")}</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-lg p-3 bg-surface2">
              {interns.length === 0 ? (
                <p className="text-muted text-sm text-center py-4">{t("assignModal.noneAvailable")}</p>
              ) : (
                interns.map(intern => (
                  <label
                    key={intern.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedInterns.has(intern.id)}
                      onCheckedChange={() => toggleIntern(intern.id)}
                      className="border-border"
                    />
                    <Avatar src={intern.avatar_url} alt={intern.full_name} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary truncate">{intern.full_name}</p>
                      <p className="text-xs text-muted">{intern.track} • {intern.level}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-muted mt-2">
              {t("assignModal.selectedCount", { count: selectedInterns.size })}
            </p>
          </div>

          <div>
            <Label htmlFor="due-date" className="text-secondary flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t("assignModal.dueDate")}
            </Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-surface2 border-border text-primary"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-secondary">{t("assignModal.notes")}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("common.placeholders.notes")}
              className="bg-surface2 border-border text-primary h-24"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border"
            >
              {t("common.actions.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isAssigning || selectedInterns.size === 0}
              className="bg-brand hover:bg-brand/90 text-white"
            >
              {isAssigning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("assignModal.assigning")}
                </>
              ) : (
                t("assignModal.assignTo", { count: selectedInterns.size })
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}