import React, { useState, useEffect } from "react";
import { Intern } from "@/entities/Intern";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import InternCard from "../components/dashboard/InternCard";
import InternDetailModal from "../components/interns/InternDetailModal";
import ChatDrawer from "../components/chat/ChatDrawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "../i18n";

export default function Interns() {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatIntern, setChatIntern] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { t } = useTranslation();

  useEffect(() => {
    loadInterns();
  }, []);

  const loadInterns = async () => {
    const data = await Intern.list('-points');
    
    // Remove duplicates by keeping only unique full_name entries
    const uniqueInterns = [];
    const seenNames = new Set();
    for (const intern of data) {
      if (!seenNames.has(intern.full_name)) {
        seenNames.add(intern.full_name);
        uniqueInterns.push(intern);
      }
    }
    
    setInterns(uniqueInterns);
  };

  const handleInternClick = (intern) => {
    setSelectedIntern(intern);
    setIsModalOpen(true);
  };

  const handleChatClick = (intern) => {
    setChatIntern(intern);
    setIsChatOpen(true);
  };

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "all" || intern.level === filterLevel;
    const matchesStatus = filterStatus === "all" || intern.status === filterStatus;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {t('interns.title', 'Team Overview')}
            </h1>
            <p className="text-muted">
              {t("interns.subtitle", "Manage and track your team's progress")}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <Input
              placeholder={t('interns.searchPlaceholder', 'Search interns...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-surface border-border text-primary placeholder:text-muted focus:border-brand"
            />
          </div>

          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-full md:w-40 bg-surface border-border text-primary">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t('interns.levelPlaceholder', 'Level')} />
            </SelectTrigger>
            <SelectContent className="bg-surface border-border">
              <SelectItem value="all">{t('interns.filters.allLevels', 'All Levels')}</SelectItem>
              <SelectItem value="Novice">{t('interns.filters.novice', 'Novice')}</SelectItem>
              <SelectItem value="Apprentice">{t('interns.filters.apprentice', 'Apprentice')}</SelectItem>
              <SelectItem value="Journeyman">{t('interns.filters.journeyman', 'Journeyman')}</SelectItem>
              <SelectItem value="Expert">{t('interns.filters.expert', 'Expert')}</SelectItem>
              <SelectItem value="Master">{t('interns.filters.master', 'Master')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-40 bg-surface border-border text-primary">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t('interns.statusPlaceholder', 'Status')} />
            </SelectTrigger>
            <SelectContent className="bg-surface border-border">
              <SelectItem value="all">{t('interns.filters.allStatus', 'All Status')}</SelectItem>
              <SelectItem value="active">{t('interns.filters.active', 'Active')}</SelectItem>
              <SelectItem value="paused">{t('interns.filters.paused', 'Paused')}</SelectItem>
              <SelectItem value="completed">{t('interns.filters.completed', 'Completed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterns.map((intern, index) => (
            <InternCard
              key={intern.id}
              intern={intern}
              onClick={handleInternClick}
              onChatClick={handleChatClick}
              index={index}
            />
          ))}
        </div>

        {filteredInterns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">
              {t('interns.empty', 'No interns found matching your filters')}
            </p>
          </div>
        )}

        <InternDetailModal
          intern={selectedIntern}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <ChatDrawer
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          intern={chatIntern}
        />
      </div>
    </div>
  );
}