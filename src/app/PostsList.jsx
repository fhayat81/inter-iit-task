"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function PostsList({ initialPosts }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Latest Posts
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Browse discussions and join the conversation
          </p>
        </div>

        {/* Posts Grid */}
        {initialPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <svg
              className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h3 className="mt-4 text-base md:text-lg font-medium text-gray-900">
              No posts yet
            </h3>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              Run the setup script to create sample posts:
            </p>
            <code className="mt-2 inline-block px-4 py-2 bg-gray-100 rounded text-xs md:text-sm">
              node scripts/setupSampleData.js
            </code>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialPosts.map((post) => (
              <Link
                key={post._id}
                href={`/post/${post._id}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Post Image */}
                {post.imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-3">
                    {truncateText(post.content)}
                  </p>

                  <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="text-blue-600 font-medium group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {initialPosts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm md:text-base text-gray-600">
              Showing {initialPosts.length} post
              {initialPosts.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
