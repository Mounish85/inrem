import React from "react";
import { Droplets, ShieldCheck, HeartHandshake, Compass } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-20 border-t-2 border-[#09090B] bg-[#09090B] text-[#F8F4E8] py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Col */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#D2E823] border-2 border-[#FFFFFF] rounded-[8px] flex items-center justify-center text-[#09090B]">
              <Droplets className="w-4 h-4" />
            </div>
            <span className="font-heading text-lg tracking-tight uppercase text-[#FFFFFF]">
              INREM Foundation
            </span>
          </div>
          <p className="font-body text-xs text-[#A1A1AA] leading-relaxed">
            Centralizing the Water Quality Champion (WQC) journey across India.
            Replacing fragmented workflows to empower communities with clean, safe drinking water.
          </p>
          <div className="inline-block px-3 py-1 bg-[#D2E823] text-[#09090B] border border-[#09090B] rounded font-mono text-[10px] font-bold">
            NEO-BRUTALIST V1.0 • ACID
          </div>
        </div>

        {/* 9 Sessions WQM */}
        <div>
          <h4 className="font-heading text-xs uppercase text-[#D2E823] tracking-wider mb-3">
            WQM Curriculum
          </h4>
          <ul className="space-y-2 text-xs font-body text-[#D4D4D8]">
            <li>9 Focused Interactive Sessions</li>
            <li>Baseline Pre-Course Assessment</li>
            <li>Session Start & End Attestations</li>
            <li>Field Resource & Protocol Access</li>
            <li>Comprehensive Post-Assessment</li>
          </ul>
        </div>

        {/* Pathways */}
        <div>
          <h4 className="font-heading text-xs uppercase text-[#D2E823] tracking-wider mb-3">
            Post-Course Pathways
          </h4>
          <ul className="space-y-2 text-xs font-body text-[#D4D4D8]">
            <li className="flex items-center space-x-2">
              <HeartHandshake className="w-3.5 h-3.5 text-[#D2E823]" />
              <span>Saathi (Peer / Alumni Network)</span>
            </li>
            <li className="flex items-center space-x-2">
              <Compass className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Guided Mentoring & Case Studies</span>
            </li>
            <li className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>Trainer Pathway (Cohort Leaders)</span>
            </li>
          </ul>
        </div>

        {/* Data Rule */}
        <div>
          <h4 className="font-heading text-xs uppercase text-[#D2E823] tracking-wider mb-3">
            Platform Architecture
          </h4>
          <p className="text-xs text-[#A1A1AA] leading-relaxed mb-3">
            Pure backend-connected platform. Powered by Node.js, Express, MongoDB Atlas, and Python FastAPI ML recommendation engine.
          </p>
          <div className="text-[11px] font-mono text-[#D2E823] border border-[#D2E823]/40 p-2 rounded bg-[#09090B]">
            ZERO MOCK DATA PROTOCOL ACTIVE
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] font-mono">
        <p>© {new Date().getFullYear()} INREM Foundation. Water Quality Champions Platform.</p>
        <p className="mt-2 sm:mt-0">Designed for Ground Impact & Community Resilience.</p>
      </div>
    </footer>
  );
};

export default Footer;

