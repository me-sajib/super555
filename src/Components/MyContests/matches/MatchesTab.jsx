"use client";
import Link from "next/link";
import React, { useState } from "react";

const MatchesTabs = ({ active }) => {
  const tabList = [
    {
      title: "Upcoming",
      id: 1,
      url: "/matches",
    },
    {
      title: "Live",
      id: 2,
      url: "/live",
    },
    {
      title: "Completed",
      id: 3,
      url: "/completed",
    }
  ];
  const [activeTab, setActiveTab] = useState(active);

  return (
    <div className="max-w-[430px] relative px-[10px] w-full mx-auto">
      <div className="w-full flex justify-between p-3 rounded-full bg-white shadow-sm">
        {tabList.map((d) => {
          const active = d.id === activeTab;

          return (
            <Link
              key={d.id}
              className={`text-[14px] rounded-full px-[25px] py-[8px] font-bold text-white ${active ? "bg-primary" : "bg-[#FFBEA9]"
                }`}
              href={d.url}
            // onClick={() => setActiveTab(d.id)}
            >
              {d.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MatchesTabs;
