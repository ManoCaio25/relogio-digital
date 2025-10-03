import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3,
  Calendar,
  Sparkles,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/entities/User";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import ThemeToggle from "./components/theme/ThemeToggle";
import NotificationBell from "./components/notifications/NotificationBell";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Team Overview",
    url: createPageUrl("Interns"),
    icon: Users,
  },
  {
    title: "Content Management",
    url: createPageUrl("ContentManagement"),
    icon: BookOpen,
  },
  {
    title: "Vacation Requests",
    url: createPageUrl("VacationRequests"),
    icon: Calendar,
  },
  {
    title: "Reports",
    url: createPageUrl("Reports"),
    icon: BarChart3,
  },
];

function LayoutContent() {
  const location = useLocation();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.log("User not loaded");
      }
    };
    loadUser();
  }, []);

  const handleLogout = React.useCallback(async () => {
    await User.logout();
  }, []);

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --bg: #F8F9FB;
          --bg-rgb: 248 249 251;
          --surface: #FFFFFF;
          --surface-rgb: 255 255 255;
          --surface-2: #F1F3F5;
          --surface-2-rgb: 241 243 245;
          --text-primary: #1F2430;
          --text-primary-rgb: 31 36 48;
          --text-secondary: #4B5563;
          --text-secondary-rgb: 75 85 99;
          --text-muted: #6B7280;
          --text-muted-rgb: 107 114 128;
          --brand: #8A2BE2;
          --brand-rgb: 138 43 226;
          --brand-2: #FF6B35;
          --brand-2-rgb: 255 107 53;
          --border: #E5E7EB;
          --border-rgb: 229 231 235;
          --success: #16A34A;
          --success-rgb: 22 163 74;
          --warning: #F59E0B;
          --warning-rgb: 245 158 11;
          --error: #E94560;
          --error-rgb: 233 69 96;
          --ring: #8A2BE2;
          --ring-rgb: 138 43 226;
          --shadow-color: 17, 24, 39;
        }

        :root.dark {
          --bg: #0F0F1F;
          --bg-rgb: 15 15 31;
          --surface: #151A2A;
          --surface-rgb: 21 26 42;
          --surface-2: #1A2032;
          --surface-2-rgb: 26 32 50;
          --text-primary: #EAEAF0;
          --text-primary-rgb: 234 234 240;
          --text-secondary: #C7CBD6;
          --text-secondary-rgb: 199 203 214;
          --text-muted: #9AA3B2;
          --text-muted-rgb: 154 163 178;
          --brand: #B390E0;
          --brand-rgb: 179 144 224;
          --brand-2: #FF814F;
          --brand-2-rgb: 255 129 79;
          --border: #2B3247;
          --border-rgb: 43 50 71;
          --success: #22C55E;
          --success-rgb: 34 197 94;
          --warning: #FBBF24;
          --warning-rgb: 251 191 36;
          --error: #F06277;
          --error-rgb: 240 98 119;
          --ring: #B390E0;
          --ring-rgb: 179 144 224;
          --shadow-color: 0, 0, 0;
        }

        .bg-bg { background-color: var(--bg); }
        .bg-surface { background-color: var(--surface); }
        .bg-surface2 { background-color: var(--surface-2); }
        .text-primary { color: var(--text-primary); }
        .text-secondary { color: var(--text-secondary); }
        .text-muted { color: var(--text-muted); }
        .text-brand { color: var(--brand); }
        .text-brand2 { color: var(--brand-2); }
        .bg-brand { background-color: var(--brand); }
        .bg-brand2 { background-color: var(--brand-2); }
        .border-border { border-color: var(--border); }
        .text-success { color: var(--success); }
        .text-warning { color: var(--warning); }
        .text-error { color: var(--error); }
        
        .shadow-e1 { box-shadow: 0 1px 3px rgba(var(--shadow-color), 0.08); }
        .shadow-e2 { box-shadow: 0 4px 12px rgba(var(--shadow-color), 0.1); }
        .shadow-e3 { box-shadow: 0 10px 24px rgba(var(--shadow-color), 0.14); }

        /* Light theme button improvements */
        .bg-success {
          background-color: var(--success);
          color: white !important;
        }
        .bg-success:hover {
          background-color: color-mix(in srgb, var(--success) 90%, black);
        }

        /* Improved contrast for error buttons in light mode */
        .border-error {
          border-color: var(--error);
        }
        .text-error {
          color: var(--error);
        }
        .hover\:bg-error\/10:hover {
          background-color: color-mix(in srgb, var(--error) 10%, transparent);
        }
        
        /* Ensure white text on colored backgrounds */
        .bg-brand, .bg-error {
          color: white !important;
        }
        
        /* Name truncation */
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-bg transition-colors duration-350">
        <Sidebar className="border-r border-border bg-surface shadow-e1">
          <SidebarHeader className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand2 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-primary">Ascenda</h2>
                <p className="text-xs text-muted">Manager Portal</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`transition-all duration-200 rounded-xl mb-1 ${
                            isActive 
                              ? 'bg-brand text-white hover:bg-brand' 
                              : 'hover:bg-surface2 text-secondary hover:text-primary'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-4 space-y-3">
            <div className="flex gap-2">
              <ThemeToggle />
              <NotificationBell />
            </div>
            {user && (
              <div className="bg-surface2 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand2 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.full_name?.charAt(0) || 'M'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary text-sm truncate">
                      {user.full_name || 'Manager'}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full text-secondary hover:text-primary hover:bg-surface2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-surface border-b border-border px-6 py-4 md:hidden shadow-e1">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-surface2 p-2 rounded-lg transition-colors duration-200 text-secondary" />
              <h1 className="text-xl font-bold text-primary">Ascenda</h1>
              <div className="ml-auto flex gap-2">
                <NotificationBell />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  );
}