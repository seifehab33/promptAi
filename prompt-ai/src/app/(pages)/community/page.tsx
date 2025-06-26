"use client";
import AuthNav from "@/components/AuthNav/AuthNav";
import Image from "next/image";
import React from "react";
import person from "@/assets/images/unknown-person.png";
import { Clock, Ellipsis } from "lucide-react";
function page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      {/* AuthNav */}
      <AuthNav />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="title-community-container mb-4">
          <div className="title-community">
            <h1 className="text-4xl font-bold text-white">
              Welcome in PromptSmith Community
            </h1>
          </div>
          <div className="description-community">
            <p className="text-gray-500 text-sm">
              PromptSmith Community is a place where you can see the prompts of
              other users
            </p>
          </div>
        </div>
        <div className="person-prompt bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg max-w-2xl p-3">
          <div className="person-info flex items-center justify-between">
            <div className="person-name flex items-center gap-2">
              <Image
                src={person}
                alt="person"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="person-name-info text-white text-sm">
                <p className="font-bold text-xl">John Doe</p>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> <span>5 hours ago</span>
                </p>
              </div>
            </div>
            <Ellipsis className="w-8 h-8 cursor-pointer" color="white" />
          </div>
          <hr className="my-2 border-t border-gray-600" />
          <div className="person-prompt-itself mt-3 mb-5">
            <div className="person-prompt-title mb-8">
              <p className="text-white text-sm">
                Title : Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos.
              </p>
            </div>
            <div className="person-prompt-content">
              <p className="text-white text-sm">
                Content : Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Quisquam, quos.
              </p>
            </div>
          </div>
          <div className="prompt-tags mb-5 flex items-center gap-2">
            <p className="bg-promptsmith-purple px-2 w-fit text-white rounded-xl text-sm">
              Marketing
            </p>
            <p className="bg-promptsmith-purple px-2 w-fit text-white rounded-xl text-sm">
              Tag 2
            </p>
            <p className="bg-promptsmith-purple px-2 w-fit text-white rounded-xl text-sm">
              Tag 3
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default page;
