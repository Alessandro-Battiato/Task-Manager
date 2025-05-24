import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Task } from "../../types/task";
import type { Project } from "../../types/project";

const ASANA_TOKEN = import.meta.env.VITE_ASANA_TOKEN;

export const apiSlice = createApi({
    reducerPath: "apiSlice",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://app.asana.com/api/1.0",
        prepareHeaders: (headers) => {
            headers.set("Authorization", `Bearer ${ASANA_TOKEN}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getTasks: builder.query<{ data: Task[] }, string>({
            query: (projectId) => ({
                url: `/projects/${projectId}/tasks`,
                params: {
                    opt_fields:
                        "name,memberships.section.name,tags.name,attachments.download_url",
                },
            }),
        }),
        getProjects: builder.query<{ data: Project[] }, void>({
            query: (workspaceId) => ({
                url: `/projects`,
                params: {
                    workspace: workspaceId,
                    opt_fields: "name",
                },
            }),
        }),
    }),
});

export const { useGetTasksQuery, useGetProjectsQuery } = apiSlice;
