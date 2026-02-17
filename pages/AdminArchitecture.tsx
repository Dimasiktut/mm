import React from 'react';
import { PRISMA_SCHEMA_PREVIEW } from '../constants';
import { Database, Server, Layers } from 'lucide-react';

export const AdminArchitecture: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Архитектура Системы</h2>
        <p className="text-slate-500">Обзор full-stack архитектуры платформы MetalMarket.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg border border-slate-200">
            <div className="flex items-center mb-3 text-blue-600">
                <Layers className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">Frontend</h3>
            </div>
            <ul className="text-sm text-slate-600 list-disc ml-5 space-y-1">
                <li>Next.js 14 (App Router)</li>
                <li>TailwindCSS + Shadcn/ui</li>
                <li>Recharts для аналитики</li>
                <li>React Hook Form + Zod</li>
            </ul>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200">
            <div className="flex items-center mb-3 text-emerald-600">
                <Server className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">Backend</h3>
            </div>
            <ul className="text-sm text-slate-600 list-disc ml-5 space-y-1">
                <li>NestJS (Модульный)</li>
                <li>Passport JWT Strategy</li>
                <li>Multer (Excel/Image upload)</li>
                <li>BullMQ (Очереди задач)</li>
            </ul>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200">
            <div className="flex items-center mb-3 text-indigo-600">
                <Database className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">Данные & Инфра</h3>
            </div>
            <ul className="text-sm text-slate-600 list-disc ml-5 space-y-1">
                <li>PostgreSQL 15+</li>
                <li>Prisma ORM</li>
                <li>S3-compatible Storage</li>
                <li>Redis (Кеширование)</li>
            </ul>
        </div>
      </div>

      <div className="bg-slate-900 text-slate-300 rounded-lg overflow-hidden shadow-lg">
        <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 font-mono text-xs flex items-center justify-between">
            <span>prisma/schema.prisma</span>
            <span className="text-slate-500">Read-only</span>
        </div>
        <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed">
            {PRISMA_SCHEMA_PREVIEW}
        </pre>
      </div>
    </div>
  );
};
