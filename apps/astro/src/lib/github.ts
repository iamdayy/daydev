const GITHUB_API_URL = "https://api.github.com";
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const GITHUB_API_VERSION = "2022-11-28";
const username = import.meta.env.GITHUB_USERNAME?.trim() || "iamdayy";
const token = import.meta.env.GITHUB_TOKEN?.trim();

interface GitHubRepository {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
}

interface GitHubEvent {
  id: string;
  type: string | null;
  repo: { name: string };
  created_at: string;
  payload: {
    action?: string;
    ref_type?: string;
    ref?: string;
    commits?: Array<{ message: string }>;
  };
}

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface GitHubData {
  user: string;
  repositories: GitHubRepository[];
  events: GitHubEvent[];
  calendar: ContributionDay[] | null;
}

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": GITHUB_API_VERSION,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function fetchGitHub<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`GitHub API mengembalikan status ${response.status}.`);
  }

  return (await response.json()) as T;
}

async function fetchContributionCalendar(year: number): Promise<ContributionDay[]> {
  if (!token) {
    return [];
  }

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query Contributions($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    color
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        login: username,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
      },
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL mengembalikan status ${response.status}.`);
  }

  const body = (await response.json()) as {
    data?: {
      user?: {
        contributionsCollection: {
          contributionCalendar: {
            weeks: Array<{ contributionDays: ContributionDay[] }>;
          };
        };
      };
    };
    errors?: Array<{ message: string }>;
  };

  if (body.errors?.length || !body.data?.user) {
    throw new Error(body.errors?.[0]?.message ?? "Data kontribusi GitHub tidak tersedia.");
  }

  return body.data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
    (week) => week.contributionDays,
  );
}

export async function getGitHubData(year = new Date().getFullYear()): Promise<GitHubData> {
  const [repositories, events, calendar] = await Promise.all([
    fetchGitHub<GitHubRepository[]>(
      `${GITHUB_API_URL}/users/${encodeURIComponent(username)}/repos?sort=pushed&direction=desc&per_page=100`,
    ),
    fetchGitHub<GitHubEvent[]>(
      `${GITHUB_API_URL}/users/${encodeURIComponent(username)}/events/public?per_page=30`,
    ),
    fetchContributionCalendar(year).catch(() => null),
  ]);

  return {
    user: username,
    repositories: repositories.filter((repository) => !repository.fork),
    events,
    calendar,
  };
}

export function getEventDescription(event: GitHubEvent): string {
  if (event.type === "PushEvent") {
    return event.payload.commits?.[0]?.message || "Mendorong commit baru";
  }
  if (event.type === "PullRequestEvent") {
    return `${event.payload.action || "Memperbarui"} pull request`;
  }
  if (event.type === "IssuesEvent") {
    return `${event.payload.action || "Memperbarui"} issue`;
  }
  if (event.type === "CreateEvent") {
    return `Membuat ${event.payload.ref_type || "resource"} baru`;
  }
  return event.type?.replace(/Event$/, "") || "Aktivitas GitHub";
}

export function getEventType(event: GitHubEvent): "push" | "pr" | "issue" | "other" {
  if (event.type === "PushEvent") return "push";
  if (event.type === "PullRequestEvent") return "pr";
  if (event.type === "IssuesEvent") return "issue";
  return "other";
}

export function getStreaks(calendar: ContributionDay[]): {
  current: number;
  longest: number;
} {
  let current = 0;
  let longest = 0;
  let run = 0;

  for (const day of calendar) {
    if (day.contributionCount > 0) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  for (let index = calendar.length - 1; index >= 0; index -= 1) {
    if (calendar[index].contributionCount === 0) break;
    current += 1;
  }

  return { current, longest };
}
