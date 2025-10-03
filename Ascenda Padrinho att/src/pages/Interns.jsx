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
import { useTranslation } from "@/i18n";

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
              {t("internsPage.title")}
            </h1>
            <p className="text-muted">{t("internsPage.subtitle")}</p>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <Input
              placeholder={t("common.placeholders.searchInterns")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-surface border-border text-primary placeholder:text-muted focus:border-brand"
            />
          </div>

          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-full md:w-40 bg-surface border-border text-primary">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t("common.filters.level")} />
            </SelectTrigger>
            <SelectContent className="bg-surface border-border">
              <SelectItem value="all">{t("common.filters.allLevels")}</SelectItem>
              <SelectItem value="Novice">{t("internsPage.levels.novice")}</SelectItem>
              <SelectItem value="Apprentice">{t("internsPage.levels.apprentice")}</SelectItem>
              <SelectItem value="Journeyman">{t("internsPage.levels.journeyman")}</SelectItem>
              <SelectItem value="Expert">{t("internsPage.levels.expert")}</SelectItem>
              <SelectItem value="Master">{t("internsPage.levels.master")}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-40 bg-surface border-border text-primary">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t("common.filters.status")} />
            </SelectTrigger>
            <SelectContent className="bg-surface border-border">
              <SelectItem value="all">{t("common.filters.allStatus")}</SelectItem>
              <SelectItem value="active">{t("common.status.active")}</SelectItem>
              <SelectItem value="paused">{t("common.status.paused")}</SelectItem>
              <SelectItem value="completed">{t("common.status.completed")}</SelectItem>
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
            <p className="text-muted">{t("internsPage.noResults")}</p>
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