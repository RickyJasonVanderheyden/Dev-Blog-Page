'use client';

import React from 'react';
import Link from 'next/link';
import { HeartIcon, CalendarIcon } from 'lucide-react';
import type { Post } from '@/lib/types';
import { motion } from 'framer-motion';

interface PostCardProps {
  post: Post;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  console.log('PostCard data:', post); // Debug log to see the post data

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="animate-scale"
    >
      <Link href={`/posts/${post.id}`} aria-label={`Read article: ${post.title}`}>
        <article 
          className="card-base overflow-hidden group cursor-pointer h-[600px] flex flex-col hover:shadow-2xl hover:shadow-slate-500/10 transition-all duration-500 hover:-translate-y-1"
          role="article"
          aria-describedby={`post-${post.id}-title post-${post.id}-excerpt`}
        >
          {(post.coverImage || post.image) && (
            <div className="relative w-full h-56 overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
              {/* Enhanced hover overlay with content preview */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm line-clamp-2 opacity-90">
                    {post.excerpt}
                  </p>
                </div>
              </div>
              <img
                src={post.coverImage || post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium text-slate-600 border border-white/20">
                  {Math.ceil(post.excerpt?.length / 100 || 1)} min read
                </div>
              </div>
              {/* Reading progress indicator */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          )}
          <div className="p-8 flex flex-col flex-grow">
            <h2 id={`post-${post.id}-title`} className="text-heading-4 mb-4 line-clamp-2 group-hover:text-slate-800 transition-colors duration-300">
              {post.title}
            </h2>
            <p id={`post-${post.id}-excerpt`} className="text-body mb-6 line-clamp-3 flex-grow leading-relaxed">
              {post.excerpt}
            </p>
            
            {/* Tags section */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-full font-medium border border-slate-200 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-500 text-xs rounded-full border border-slate-200/50">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {/* Author and metadata section - always at bottom */}
            <div className="flex-between text-small mt-auto pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                {post.author?.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.username}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-slate-200 transition-all duration-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex-center ring-2 ring-slate-100">
                    <span className="text-slate-600 font-semibold text-sm">
                      {post.author?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-slate-800 block">
                    {post.author?.username || 'Unknown User'}
                  </span>
                  <span className="text-slate-500 text-xs">
                    Author
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-xs">{formattedDate}</span>
                </span>
                <span className="flex items-center gap-1.5 group-hover:text-slate-600 transition-colors duration-300">
                  <HeartIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">{post.likeCount || 0}</span>
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}



