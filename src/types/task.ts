import type { Status } from "../components/Board/types";

export type Task = { id: string; name: string; status: Status; tags: string[] };
