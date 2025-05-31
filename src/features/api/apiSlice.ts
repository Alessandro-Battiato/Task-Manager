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
    tagTypes: ["Project", "Task"],
    endpoints: (builder) => ({
        getTasks: builder.query<{ data: Task[] }, string>({
            query: (projectId) => ({
                url: `/projects/${projectId}/tasks`,
                params: {
                    opt_fields:
                        "name,memberships.section.name,tags.name,attachments.download_url",
                },
            }),
            providesTags: (result, _, projectId) =>
                result
                    ? [
                          ...result.data.map(({ gid }) => ({
                              type: "Task" as const,
                              id: gid,
                          })),
                          {
                              type: "Task" as const,
                              id: "LIST",
                              parentId: projectId,
                          },
                      ]
                    : [
                          {
                              type: "Task" as const,
                              id: "LIST",
                              parentId: projectId,
                          },
                      ],
        }),
        getProjects: builder.query<{ data: Project[] }, string>({
            query: (workspaceId) => ({
                url: `/projects`,
                params: {
                    workspace: workspaceId,
                    opt_fields: "name,gid",
                },
            }),
            providesTags: (result, _, workspaceId) =>
                result
                    ? [
                          ...result.data.map(({ gid }) => ({
                              type: "Project" as const,
                              id: gid,
                          })),
                          {
                              type: "Project" as const,
                              id: "LIST",
                              workspace: workspaceId,
                          },
                      ]
                    : [
                          {
                              type: "Project" as const,
                              id: "LIST",
                              workspace: workspaceId,
                          },
                      ],
        }),

        createProject: builder.mutation({
            query: (newProjectData) => {
                return {
                    url: "/projects",
                    method: "POST",
                    body: { data: newProjectData },
                };
            },
            invalidatesTags: (_, __, { workspace }) => [
                { type: "Project", id: "LIST", workspace },
            ],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useGetProjectsQuery,
    useCreateProjectMutation,
} = apiSlice;
