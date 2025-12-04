import JobCard from "./components/JobCard";
import Header from "./components/Header";
import { fetchJobs } from './services/jobs';

export default async function Home() {
  const jobs = await fetchJobs();

  // Show ONLY jobs with a valid logo
  const validJobs = jobs.filter((job) =>
    job.logoUrl && job.logoUrl.trim() !== ""
  );

  return (
    <>
      {Header(validJobs.length)}
      {validJobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </>
  );
}