'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { PenSquareIcon, LogOutIcon, UserIcon, SearchIcon, MenuIcon, XIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { postsApi } from '@/lib/api';
import { getStaticImageUrl } from '@/lib/imageUtils';
import type { Post } from '@/lib/types';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length > 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await postsApi.search(searchQuery);
          setSearchResults(response.data.slice(0, 5)); // Limit to 5 results
          setShowSearchResults(true);
        } catch (error: any) {
          console.error('Search failed:', error);
          // Only log error, don't show error state for search - just show no results
          setSearchResults([]);
          setShowSearchResults(false);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search when navigating
  useEffect(() => {
    const handleRouteChange = () => {
      setSearchQuery('');
      setShowSearchResults(false);
      setSearchResults([]);
    };

    // Clear search on route change using pathname
    handleRouteChange();
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = (postId: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    router.push(`/posts/${postId}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-orange-200/95 backdrop-blur-lg border-b-4 border-orange-300/50 shadow-2xl ring-1 ring-orange-400 transition-all duration-300"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand Section */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3"
          >
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl shadow-xl group-hover:shadow-2xl transition-all duration-300 border-2 border-amber-600 overflow-hidden">
                  <img 
                    src={getStaticImageUrl(
                      'YP4VTpzwTSW8V8mXMKSQEQ.webp',
                      'https://res.cloudinary.com/dwwjx5yd1/image/upload/v1764053161/YP4VTpzwTSW8V8mXMKSQEQ_tm1khi.webp'
                    )}
                    alt="Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a simple placeholder if image fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement!;
                      parent.innerHTML = '<div class="w-full h-full bg-amber-600 flex items-center justify-center text-white font-bold text-lg">D</div>';
                    }}
                  />
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10 blur-sm" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-amber-800 group-hover:text-amber-900 transition-colors duration-300">
                  DevSpace
                </span>
                <div className="text-xs text-amber-600 -mt-1">
                  Share Your Ideas
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8" ref={searchRef}>
            <div className="relative w-full">
              <form onSubmit={handleSearchSubmit}>
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  className="w-full pl-10 pr-4 py-2 bg-orange-50 border border-orange-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all duration-300"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  </div>
                )}
              </form>
              
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 max-h-80 overflow-y-auto"
                  >
                    {searchResults.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => handleResultClick(post.id)}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-200 border-b border-slate-100 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          {post.coverImage && (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-800 text-sm line-clamp-1 mb-1">
                              {post.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-400">
                                By {post.author?.username}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    <div className="px-4 py-2 border-t border-slate-100">
                      <button
                        onClick={() => handleSearchSubmit(new Event('submit') as any)}
                        className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-200"
                      >
                        View all results for "{searchQuery}" →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {/* Navigation Links */}
                <div className="flex items-center gap-1">
                  <NavLink href="/" label="Home" />
                  <NavLink href="/posts" label="Articles" />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Write Post Button */}
                  <Link href="/posts/create">
                    <Button
                      variant="primary"
                      size="sm"
                      className="gap-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <PenSquareIcon className="w-4 h-4" />
                      Write
                    </Button>
                  </Link>

                  {/* User Profile Dropdown */}
                  <UserDropdown user={user} onLogout={handleLogout} />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
          >
            {isMobileMenuOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu 
            user={user} 
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// Navigation Link Component
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
    >
      {label}
    </Link>
  );
}

// User Dropdown Component
function UserDropdown({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-all duration-200"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200 flex-center ring-2 ring-slate-200">
            <UserIcon className="w-4 h-4 text-slate-600" />
          </div>
        )}
        <span className="text-base font-semibold text-slate-700 hidden lg:block">
          {user?.username}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50"
          >
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
            >
              <UserIcon className="w-4 h-4" />
              Profile
            </Link>
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
            >
              <LogOutIcon className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile Menu Component
function MobileMenu({ user, isAuthenticated, onLogout, onClose }: { user: any; isAuthenticated: boolean; onLogout: () => void; onClose: () => void }) {
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const router = useRouter();

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery)}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200"
    >
      <div className="px-6 py-4 space-y-4">
        {/* Search Bar Mobile */}
        <form onSubmit={handleMobileSearch}>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </form>

        {isAuthenticated ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-center">
                  <UserIcon className="w-5 h-5 text-slate-600" />
                </div>
              )}
              <div>
                <div className="font-medium text-slate-800">{user?.username}</div>
                <div className="text-sm text-slate-500">Author</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="/posts"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                Articles
              </Link>
              <Link
                href="/posts/create"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <PenSquareIcon className="w-4 h-4" />
                Write Article
              </Link>
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                <UserIcon className="w-4 h-4" />
                Profile
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 w-full text-left"
              >
                <LogOutIcon className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Link href="/auth/login" onClick={onClose}>
              <Button variant="ghost" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register" onClick={onClose}>
              <Button variant="primary" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}


