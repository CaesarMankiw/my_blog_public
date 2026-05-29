"use client";
import { useEffect, useState } from "react";

// WMO weather codes -> emoji + zh label (Open-Meteo). No API key required.
const CODES: Record<number, [string, string]> = {
  0: ["☀️", "晴"], 1: ["🌤️", "少云"], 2: ["⛅", "多云"], 3: ["☁️", "阴"],
  45: ["🌫️", "雾"], 48: ["🌫️", "雾凇"], 51: ["🌦️", "毛毛雨"], 53: ["🌦️", "小雨"],
  55: ["🌧️", "中雨"], 61: ["🌧️", "小雨"], 63: ["🌧️", "中雨"], 65: ["🌧️", "大雨"],
  71: ["🌨️", "小雪"], 73: ["🌨️", "中雪"], 75: ["❄️", "大雪"], 80: ["🌦️", "阵雨"],
  81: ["🌧️", "阵雨"], 82: ["⛈️", "暴雨"], 95: ["⛈️", "雷阵雨"], 99: ["⛈️", "冰雹"],
};

export default function Weather() {
  const [data, setData] = useState<{ temp: number; code: number; wind: number } | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const url =
      "https://api.open-meteo.com/v1/forecast?latitude=39.9042&longitude=116.4074" +
      "&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FShanghai";
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        const c = j.current;
        setData({ temp: Math.round(c.temperature_2m), code: c.weather_code, wind: Math.round(c.wind_speed_10m) });
      })
      .catch(() => setErr(true));
  }, []);

  const [icon, label] = data ? CODES[data.code] ?? ["🌡️", "—"] : ["", ""];

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-base font-bold text-slate-800">北京 · Beijing</h3>
        <span className="text-xs text-slate-400">实时天气</span>
      </div>
      {err ? (
        <p className="mt-3 text-sm text-slate-400">天气加载失败</p>
      ) : !data ? (
        <p className="mt-3 text-sm text-slate-400 animate-pulse">加载中…</p>
      ) : (
        <div className="mt-2 flex items-center gap-3">
          <span className="text-4xl leading-none">{icon}</span>
          <div>
            <div className="text-3xl font-bold text-slate-800">{data.temp}°C</div>
            <div className="text-sm text-slate-500">{label} · 风 {data.wind} km/h</div>
          </div>
        </div>
      )}
    </div>
  );
}
