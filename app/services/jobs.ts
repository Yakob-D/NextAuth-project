import JobInterface from '../Job';

const BASE_URL = "https://akil-backend.onrender.com";

export async function fetchJobs(): Promise<JobInterface[]> {
    const response = await fetch(`${BASE_URL}/opportunities/search`, {
        cache: "no-store",
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Failed to fetch jobs (${response.status}): ${text}`);
    }

    const json = await response.json().catch(() => null);
    const data = json?.data ?? json;

    if (!Array.isArray(data)) {
        throw new Error("Jobs API returned non-array data");
    }

    return data as JobInterface[];
}

export async function fetchJobById(id: string): Promise<JobInterface> {
    const response = await fetch(`${BASE_URL}/opportunities/${id}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Failed to fetch job (${response.status}): ${text}`);
    }

    const json = await response.json().catch(() => null);
    const data = json?.data ?? json;

    if (!data || typeof data !== "object") {
        throw new Error("Job API returned invalid data");
    }

    return data as JobInterface;
}