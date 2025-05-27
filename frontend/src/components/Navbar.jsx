import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Home, BookOpen, Bookmark, List, User, Settings, Languages, PenTool, Bell, LogOut, LogIn, UserPlus, AlertCircle, X, Menu, HelpCircle, Clock, Search, LayoutGrid } from 'lucide-react';
import openBookLogo from '../assets/open-book.svg';
import SearchDialog from './SearchDialog';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isMobileMoreMenuOpen, setIsMobileMoreMenuOpen] = useState(false);

    // Use location hook to get current path
    const location = useLocation();

    // Empêcher le défilement du body quand le menu est ouvert
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    // Close the desktop "more" menu when mobile menu is opened
    useEffect(() => {
        if (isMenuOpen) {
            setIsMoreMenuOpen(false);
        }
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleMoreMenu = () => {
        setIsMoreMenuOpen(!isMoreMenuOpen);
    };

    const toggleMobileMoreMenu = () => {
        setIsMobileMoreMenuOpen(!isMobileMoreMenuOpen);
    };

    // Check if path matches current location
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        if (path === '/settings') {
            return location.pathname === '/profile' && location.search.includes('tab=settings');
        }
        return location.pathname.startsWith(path);
    };

    // Navigation items for desktop menu
    const navItems = [
        { to: "/", icon: <Home className="w-5 h-5" />, label: "Home" },
        { to: "/library", icon: <BookOpen className="w-5 h-5" />, label: "Library" },
        { to: "/bookmarks", icon: <Bookmark className="w-5 h-5" />, label: "Bookmarks" },
        { to: "/readers", icon: <List className="w-5 h-5" />, label: "Best Readers" },
    ];

    return (
        <nav className="bg-black border-b border-white/10 shadow-lg fixed w-full top-0 left-0 z-50">
            {/* Removed Session Expired Alert */}

            <div className="mx-auto relative max-w-7xl">
                {/* Desktop Navbar */}
                <div className="hidden md:flex items-center justify-between h-16 px-4">
                    {/* Left side - Logo and brand */}
                    <div className="flex items-center relative z-20">
                        <Link to="/" className="flex items-center group">
                            <div className="relative text-white mr-4 transition-all duration-500 group-hover:scale-110">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-white/20 rounded-2xl blur-xl"></div>
                                <div className="relative p-2 rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-500 group-hover:shadow-purple-500/20">
                                    <img src={openBookLogo} alt="Open Book Logo" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">Night Novels</span>
                                    <div className="h-4 w-[1px] bg-gradient-to-b from-white/5 via-white/10 to-white/5"></div>
                                    <span className="text-xs text-white/50 uppercase tracking-wider font-medium">Beta</span>
                                </div>
                                <span className="text-[0.65rem] text-white/40 font-medium">Your Reading Journey</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation Menu */}
                    <div className="flex items-center justify-center">
                        <div className="flex items-center px-4 py-1 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                            {navItems.map((item) => {
                                const active = isActive(item.to);
                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className={`group flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${active ? 'bg-white/10' : 'hover:bg-white/10'} ${active ? 'relative' : ''}`}
                                    >
                                        {active && (
                                            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                        )}
                                        <div className={`p-1.5 rounded-lg ${active ? 'text-purple-400' : 'text-white/70 group-hover:text-white'}`}>
                                            {item.icon}
                                        </div>
                                        <span className={`text-sm font-medium ${active ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Search Button */}
                        <SearchDialog
                            trigger={
                                <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                                    <Search className="w-4 h-4" />
                                </button>
                            }
                        />

                        {/* Notifications Button - Simplified */}
                        <Link
                            to="/notifications"
                            className="relative"

                        >
                            <div className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95">

                                <Bell className="w-4 h-4" />
                            </div>
                        </Link>

                        {/* Simplified Login/Signup links */}
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/auth/register"
                                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                            >
                                Créer un compte
                            </Link>
                            <div className="h-4 w-[1px] bg-white/10"></div>
                            <Link
                                to="/auth/login"
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all duration-300 hover:scale-105 font-medium"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Connexion</span>
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Mobile Navbar - Optimisé pour tous les téléphones */}
                <div className="flex md:hidden items-center justify-between h-14 px-3 sm:h-16 sm:px-4">
                    {/* Left side - Logo and brand */}
                    <div className="flex items-center relative z-20">
                        <Link to="/" className="flex items-center group">
                            <div className="relative text-white mr-3 transition-all duration-500 group-hover:scale-110">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-white/20 rounded-2xl blur-xl"></div>
                                <div className="relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-black/50 backdrop-blur-sm border border-white/10 shadow-[0_8px_32px_rgb(0_0_0/0.4)] transition-all duration-500 group-hover:shadow-purple-500/20">
                                    <img src={openBookLogo} alt="Open Book Logo" className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center space-x-1 sm:space-x-2">
                                    <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">Night Novels</span>
                                    <div className="h-3 sm:h-4 w-[1px] bg-gradient-to-b from-white/5 via-white/10 to-white/5"></div>
                                    <span className="text-[0.6rem] sm:text-xs text-white/50 uppercase tracking-wider font-medium">Beta</span>
                                </div>
                                <span className="text-[0.6rem] sm:text-[0.65rem] text-white/40 font-medium">Your Reading Journey</span>
                            </div>
                        </Link>
                    </div>

                    {/* Right side - Actions for mobile */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <SearchDialog
                            trigger={
                                <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95 touch-manipulation">
                                    <Search className="w-4 h-4" />
                                </button>
                            }
                        />

                        {/* Notification button for mobile - Simplified */}
                        <Link
                            to="/notifications"
                            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"

                        >

                            <Bell className="w-4 h-4" />
                        </Link>

                        {/* Mobile menu button - Optimisé pour interactions tactiles */}
                        <button
                            onClick={toggleMenu}
                            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95 z-50 touch-manipulation"
                            aria-label="Menu principal"
                        >
                            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Slide-in side panel) - Optimisé pour tous les téléphones */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/95 md:hidden z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    <div className="fixed top-0 left-0 h-[100dvh] w-[85vw] max-w-[320px] bg-black/95 backdrop-blur-xl border-r border-white/10 shadow-xl md:hidden z-50 overflow-hidden animate-in slide-in-from-left duration-300">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10 bg-black/50">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 p-1.5">
                                        <img src={openBookLogo} alt="Logo" className="w-full h-full" />
                                    </div>
                                    <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">Night Novels</span>
                                </div>

                            </div>

                            {/* Simplified User Info Section for Mobile Menu (Optional - you could remove this) */}
                            {/* You might want to keep a placeholder or remove this section entirely */}
                            <div className="p-3 sm:p-4 border-b border-white/10 bg-black/50">
                                <div className="flex items-center space-x-3">
                                    <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm sm:text-base text-white font-medium">Guest User</span>
                                        <span className="text-xs sm:text-sm text-white/50">Not Logged In</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-5 sm:space-y-6 px-2 bg-transparent">
                                {/* Navigation Section */}
                                <div className="space-y-1">
                                    <div className="px-3 text-xs font-medium text-white/40 uppercase tracking-wider">Navigation</div>
                                    <Link
                                        to="/"
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isActive('/') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive('/') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                            <Home className="w-4 h-4" />
                                        </div>
                                        <span>Accueil</span>
                                    </Link>

                                    <Link
                                        to="/library"
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isActive('/library') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive('/library') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <span>Bibliothèque</span>
                                    </Link>

                                    <Link
                                        to="/bookmarks"
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isActive('/bookmarks') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive('/bookmarks') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                            <Bookmark className="w-4 h-4" />
                                        </div>
                                        <span>Favoris</span>
                                    </Link>

                                    <Link
                                        to="/readers"
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isActive('/readers') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive('/readers') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                            <List className="w-4 h-4" />
                                        </div>
                                        <span>Meilleurs lecteurs</span>
                                    </Link>
                                </div>

                                {/* Removed Profile Section */}


                                {/* Removed Rejoignez-nous Section */}


                                {/* Settings & Help Section - Simplified to just Settings and Help */}
                                <div className="space-y-1">
                                    <div className="px-3 text-xs font-medium text-white/40 uppercase tracking-wider">Paramètres</div>
                                    <Link
                                        to="/profile?tab=settings"
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isActive('/settings') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive('/settings') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                            <Settings className="w-4 h-4" />
                                        </div>
                                        <span>Paramètres</span>
                                    </Link>

                                    <Link
                                        to="/help"
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg ${isActive('/help') ? 'bg-white/10 text-white' : 'text-white/80 hover:text-white hover:bg-white/5'} transition-all group touch-manipulation`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className={`p-2 rounded-lg ${isActive('/help') ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 group-hover:border-purple-500/50'} border transition-colors`}>
                                            <HelpCircle className="w-4 h-4" />
                                        </div>
                                        <span>Aide & Support</span>
                                    </Link>
                                </div>

                            </div>

                            {/* Bottom Section - Login/Signup */}
                            <div className="p-3 sm:p-4 mt-auto border-t border-white/10 bg-black/50">

                                <div className="space-y-3">
                                    <Link
                                        to="/auth/login"
                                        className="flex items-center justify-center w-full space-x-2 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors font-medium touch-manipulation active:bg-purple-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span>Connexion</span>
                                    </Link>
                                    <Link
                                        to="/auth/register"
                                        className="flex items-center justify-center w-full space-x-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors touch-manipulation active:bg-white/15"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        <span>Créer un compte</span>
                                    </Link>
                                    <p className="text-center text-xs text-white/40 px-2">
                                        Rejoignez notre communauté pour accéder à toutes les fonctionnalités
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </>
            )}
        </nav>
    );
};

export default Navbar;