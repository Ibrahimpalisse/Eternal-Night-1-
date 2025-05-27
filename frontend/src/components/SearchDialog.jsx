import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Book, History, X, Clock, TrendingUp } from 'lucide-react';

const SearchDialog = ({ trigger }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [recentSearches, setRecentSearches] = React.useState([
    'Fantasy novels', 'Science fiction', 'Romance', 'Mystery'
  ]);
  const [suggestions, setSuggestions] = React.useState([
    'Harry Potter', 'Lord of the Rings', 'Game of Thrones', 'Dune'
  ]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      // Ajouter la recherche aux recherches récentes
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev].slice(0, 4));
      }
      // Process search logic here
      // ...
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    // You could automatically submit the search here if desired
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Gérer la touche ESC
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-black/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-white/20 rounded-xl blur-lg"></div>
                <Search className="relative w-6 h-6 text-white/90" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Night Novels
              </span>
            </div>
            <p className="text-sm text-gray-400 font-normal">Découvrez votre prochaine lecture préférée</p>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="flex items-center space-x-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for novels, authors, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 w-full h-12 bg-white/10 border-white/10 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              autoFocus
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button 
            type="submit" 
            className="h-12 px-6 bg-purple-600 hover:bg-purple-500 text-white transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </div>
            ) : (
              'Search'
            )}
          </Button>
        </form>

        <div className="mt-8 grid grid-cols-2 gap-8">
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-400 mb-4">
                <Clock className="h-4 w-4 mr-2" />
                Recent searches
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 cursor-pointer transition-all duration-200"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    <History className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-white/90">{search}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular suggestions */}
          {suggestions.length > 0 && (
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-400 mb-4">
                <TrendingUp className="h-4 w-4 mr-2" />
                Popular searches
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 cursor-pointer transition-all duration-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Book className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="text-white/90">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1.5">
            <kbd className="px-2 py-1 bg-white/10 rounded-md text-gray-400 font-mono">Échap</kbd>
            <span>Fermer la recherche</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-800"></div>
          <div className="flex items-center space-x-1.5">
            <kbd className="px-2 py-1 bg-white/10 rounded-md text-gray-400 font-mono">Entrée</kbd>
            <span>Lancer la recherche</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog; 