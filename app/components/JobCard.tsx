import JobInterface from "../Job";
import Link from "next/link";
import Image from "next/image";

const JobCard = (job: JobInterface) => {
  return (
    <div className="border-gray-300 border rounded-4xl mr-100 ml-30 mt-5 mb-5 p-5 hover:bg-gray-300">
      <div className="p-2 flex gap-6">
        <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
          {job.logoUrl ? (
            <Image
              src={job.logoUrl}
              alt={`${job.orgName} logo`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
              No Logo
            </div>
          )}
        </div>

        <div className="">
          <Link href={`/jobs/${job.id}`} className="text-xl font-semibold mb-1">
            {job.title}
          </Link>
          <p className="text-gray-500 mb-2">
            {job.orgName} • {" "}
            {job.location.join(', ')}
          </p>
          <p>{job.description}</p>
          <div className="flex align-center mt-2">
            <div className="text-[#56CDAD] bg-green-100 p-2 rounded-3xl text-center text-sm font-semibold">
              {job.opType}
            </div>
            <div className="h-9 w-0.5 bg-gray-300 mx-3"></div>
            <hr className="text-black" />
            <div className="flex gap-2 align-center justify-center  text-sm">
              {job.categories.map((category, index) => {
                const isEven = index % 2 === 0;
                const colorClasses = isEven
                  ? "text-amber-400"
                  : "text-[#4640DE]";

                return (
                  <div
                    key={index}
                    className={`${colorClasses} min-w-20 text-center border-2 pt-2 pb-2 pr-4 pl-4 rounded-3xl font-semibold`}
                  >
                    {category}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;