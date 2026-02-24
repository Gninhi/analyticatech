import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Command, Sun, Monitor, Mail, FileText, Database } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string[];
  category: 'Navigation' | 'Système' | 'Contact';
}

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // --- ACTIONS ---
  const actions: CommandItem[] = [
    { id: 'home', label: 'Aller à l\'Accueil', icon: Monitor, category: 'Navigation', action: () => navigate('/') },
    { id: 'services', label: 'Explorer les Services', icon: FileText, category: 'Navigation', action: () => navigate('/services') },
    { id: 'solutions', label: 'Catalogue Solutions', icon: Command, category: 'Navigation', action: () => navigate('/solutions') },
    { id: 'hub', label: 'Intelligence Hub (Prompts/Ressources)', icon: Database, category: 'Navigation', action: () => navigate('/hub') },
    { id: 'contact', label: 'Initialiser un Projet', icon: Mail, category: 'Contact', action: () => navigate('/contact') },
    { 
      id: 'theme', 
      label: 'Basculer le Thème', 
      icon: Sun, 
      category: 'Système', 
      action: () => {
        document.documentElement.classList.toggle('dark');
      },
      shortcut: ['T']
    },
  ];

  // Filtrage
  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  // --- SHORTCUTS LISTENER ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Ctrl+K / Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      }
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].action();
          setIsOpen(false);
          setQuery('');
        }
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex]);

  // Reset index on query change
  useEffect(() => setSelectedIndex(0), [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl bg-white dark:bg-analytica-night border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[60vh]"
          >
            {/* Input */}
            <div className="flex items-center px-4 py-4 border-b border-slate-200 dark:border-slate-800">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                autoFocus
                type="text" 
                placeholder="Tapez une commande ou recherchez..." 
                className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400 font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
                ESC
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm">
                  Aucun résultat trouvé.
                </div>
              ) : (
                filteredActions.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-colors ${
                      index === selectedIndex 
                        ? 'bg-analytica-accent text-white' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={index === selectedIndex ? 'text-white' : 'text-slate-400'} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.shortcut && (
                       <div className="flex gap-1">
                         {item.shortcut.map(key => (
                           <span key={key} className={`text-[10px] font-mono px-1.5 rounded ${
                             index === selectedIndex ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                           }`}>
                             {key}
                           </span>
                         ))}
                       </div>
                    )}
                    {index === selectedIndex && <ArrowRight size={14} />}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-analytica-deep border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <div className="flex gap-4">
                <span>Navigation <strong className="font-mono">↑↓</strong></span>
                <span>Selection <strong className="font-mono">↵</strong></span>
              </div>
              <span className="font-mono text-analytica-accent">Analytica OS v3.0</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;