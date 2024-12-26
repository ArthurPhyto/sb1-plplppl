"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getMovieStats, getCategoryStats, getVisitorStats } from "@/lib/analytics";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("7");
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [movieStats, setMovieStats] = useState<any[]>([]);
  const [visitorStats, setVisitorStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const days = parseInt(dateRange);
      const [movies, categories, visitors] = await Promise.all([
        getMovieStats(days),
        getCategoryStats(days),
        getVisitorStats(days)
      ]);

      setMovieStats(movies || []);
      setCategoryStats(categories || []);
      setVisitorStats(visitors);
    };

    fetchStats();
  }, [dateRange]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">
          Période
        </label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
        >
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
          <option value="90">90 derniers jours</option>
        </select>
      </div>

      {visitorStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">Visiteurs uniques</h3>
            <p className="text-2xl font-bold">{visitorStats.unique_visitors}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">Pages vues</h3>
            <p className="text-2xl font-bold">{visitorStats.total_views}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">Vues moyennes par visiteur</h3>
            <p className="text-2xl font-bold">{visitorStats.avg_views_per_visitor.toFixed(1)}</p>
          </div>
        </div>
      )}

      <div className="grid gap-8">
        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Catégories les plus consultées</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Films les plus consultés</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={movieStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}