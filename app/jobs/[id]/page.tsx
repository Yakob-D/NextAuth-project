"use client";
import JobInterface from "../../Job";
import { LuCirclePlus, LuCalendarCheck, LuCalendar1 } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import { GrLocation } from "react-icons/gr";
import { fetchJobById } from "@/app/services/jobs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type IconBoxProps = {
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
};

const IconBox = ({ children, size = "md", className = "" }: IconBoxProps) => {
  const base =
    "flex items-center justify-center rounded-3xl border border-gray-300";
  const sizing = size === "sm" ? "p-1 w-8 h-8" : "p-3 w-12 h-12";
  return <div className={`${base} ${sizing} ${className}`}>{children}</div>;
};

export default function JobPage() {
  const params = useParams();
  const raw_id = params.id;
  const id = Array.isArray(raw_id) ? raw_id[0] : raw_id;
  const [job, setJob] = useState<JobInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadJob = async () => {
      try {
        const fetchedJob = await fetchJobById(id);
        setJob(fetchedJob);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load job details";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  if (!id) {
    return <div className="p-10">Job ID is missing.</div>;
  }

  if (loading) return <div className="p-10">Loading job...</div>;
  if (error || !job) return <div className="p-10">Job not found.</div>;

  const responsibilities = job.responsibilities
    ? job.responsibilities.split("\n")
    : [];

  return (
    <div className="flex flex-row flex-1 p-10 gap-10">
      <div>
        <div>
          <h1 className="text-[#25324B] text-2xl font-black mb-2 mt-10">
            Description
          </h1>
          <p className="text-md">{job.description}</p>
        </div>

        <div>
          <h1 className="text-[#25324B] text-2xl font-black mt-10 mb-2">
            Responsibilities
          </h1>
          <ul>
            {responsibilities.map((resp, idx) => (
              <li key={idx} className="flex gap-3 items-start text-md">
                <IconBox size="sm" className="border-0 bg-transparent">
                  <GoDotFill className="text-xs" aria-hidden />
                </IconBox>
                <span className="mt-0.5">{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h1 className="text-[#25324B] text-2xl font-black mt-10 mb-2">
            Ideal Candidate
          </h1>
          <p className="text-md whitespace-pre-line">{job.idealCandidate}</p>
        </div>

        <div>
          <h1 className="text-[#25324B] text-2xl font-black mt-10 mb-2">
            When & Where
          </h1>
          <div className="flex items-center gap-4">
            <IconBox size="sm">
              <GrLocation className="text-[#26A4FF] text-base" aria-hidden />
            </IconBox>
            <p className="text-md">{job.location.join(", ")}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div>
          <h1 className="text-[#25324B] text-2xl font-black mb-5">About</h1>

          <div className="flex gap-4 mb-4">
            <IconBox size="sm">
              <LuCirclePlus className="text-[#26A4FF] text-base" aria-hidden />
            </IconBox>
            <div>
              <p className="text-[#515B6F] text-[14px] mt-[-5]">Posted On</p>
              <p className="font-semibold text-[14px]">{job.datePosted}</p>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <IconBox size="sm">
              <MdOutlineLocalFireDepartment
                className="text-[#26A4FF] text-base"
                aria-hidden
              />
            </IconBox>
            <div>
              <p className="text-[#515B6F] text-[14px] mt-[-5]">Deadline</p>
              <p className="font-semibold text-[14px]">{job.deadline}</p>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <IconBox size="sm">
              <GrLocation className="text-[#26A4FF] text-base" aria-hidden />
            </IconBox>
            <div>
              <p className="text-[#515B6F] text-[14px] mt-[-5]">Location</p>
              <p className="font-semibold text-[14px]">
                {job.location.join(", ")}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <IconBox size="sm">
              <LuCalendar1 className="text-[#26A4FF] text-base" aria-hidden />
            </IconBox>
            <div>
              <p className="text-[#515B6F] text-[14px] mt-[-5]">Start Date</p>
              <p className="font-semibold text-[14px]">{job.startDate}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <IconBox size="sm">
              <LuCalendarCheck
                className="text-[#26A4FF] text-base"
                aria-hidden
              />
            </IconBox>
            <div>
              <p className="text-[#515B6F] text-[14px] mt-[-5]">End Date</p>
              <p className="font-semibold text-[14px]">{job.endDate}</p>
            </div>
          </div>
        </div>

        <hr className="text-gray-400 mt-10" />

        <div>
          <h1 className="text-[#25324B] text-2xl font-black mt-10 mb-2">
            Categories
          </h1>
          <div className="flex gap-2">
            {job.categories.map((category, idx) => {
              const isEven = idx % 2 === 0;
              const colorClasses = isEven
                ? "text-amber-400 bg-amber-100"
                : "text-green-600 bg-green-100";

              return (
                <div
                  key={idx}
                  className={`${colorClasses} text-[12px] px-3 py-1 rounded-3xl`}
                >
                  {category}
                </div>
              );
            })}
          </div>
        </div>

        <hr className="text-gray-400 mt-6" />

        <div>
          <h1 className="text-[#25324B] text-2xl font-black mt-10 mb-2">
            Required Skills
          </h1>
          <div className="flex gap-2">
            {job.requiredSkills?.map((skill, idx) => (
              <div
                key={idx}
                className="text-[12px] text-[#4640DE] bg-gray-100 pl-3 pr-3 pt-1 pb-1 rounded"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
