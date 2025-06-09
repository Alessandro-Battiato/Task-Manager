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
    tagTypes: ["Project", "Task", "Section"],
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
        createTask: builder.mutation({
            query: ({ projectId, taskData }) => ({
                url: `/tasks`,
                method: "POST",
                body: {
                    data: {
                        ...taskData,
                        projects: [projectId],
                    },
                },
            }),
            invalidatesTags: (_, __, { projectId }) => [
                { type: "Task", id: "LIST", parentId: projectId },
            ],
        }),
        updateTask: builder.mutation<
            Task,
            { taskId: string; taskData: Partial<Task>; projectId: string }
        >({
            query: ({ taskId, taskData }) => ({
                url: `/tasks/${taskId}`,
                method: "PUT",
                body: {
                    data: taskData,
                },
            }),
            invalidatesTags: (_, __, { taskId, projectId }) => [
                { type: "Task", id: taskId },
                { type: "Task", id: "LIST", parentId: projectId },
            ],
        }),
        moveTaskToSection: builder.mutation<
            void,
            { sectionId: string; taskId: string; projectId: string }
        >({
            query: ({ sectionId, taskId }) => ({
                url: `/sections/${sectionId}/addTask`,
                method: "POST",
                body: {
                    data: {
                        task: taskId,
                    },
                },
            }),
        }),
        deleteTask: builder.mutation<
            void,
            { taskId: string; projectId: string }
        >({
            query: ({ taskId }) => ({
                url: `/tasks/${taskId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_, __, { projectId }) => [
                { type: "Task", id: "LIST", parentId: projectId },
            ],
        }),
        addTagToTask: builder.mutation<
            void,
            { taskId: string; tagId: string; projectId: string }
        >({
            query: ({ taskId, tagId }) => ({
                url: `/tasks/${taskId}/addTag`,
                method: "POST",
                body: {
                    data: {
                        tag: tagId,
                    },
                },
            }),
            invalidatesTags: (_, __, { taskId, projectId }) => [
                { type: "Task", id: taskId },
                { type: "Task", id: "LIST", parentId: projectId },
            ],
        }),
        removeTagFromTask: builder.mutation<
            void,
            { taskId: string; tagId: string; projectId: string }
        >({
            query: ({ taskId, tagId }) => ({
                url: `/tasks/${taskId}/removeTag`,
                method: "POST",
                body: {
                    data: {
                        tag: tagId,
                    },
                },
            }),
            invalidatesTags: (_, __, { taskId, projectId }) => [
                { type: "Task", id: taskId },
                { type: "Task", id: "LIST", parentId: projectId },
            ],
        }),
        getTags: builder.query<
            { data: Array<{ gid: string; name: string }> },
            string
        >({
            query: (workspaceId) => ({
                url: `/tags`,
                params: {
                    workspace: workspaceId,
                    opt_fields: "name,gid",
                },
            }),
            providesTags: (result) =>
                result
                    ? result.data.map((task) => ({
                          type: "Task",
                          id: task.gid,
                      }))
                    : [],
        }),
        getProjectSections: builder.query<
            { data: Array<{ gid: string; name: string }> },
            string
        >({
            query: (projectId) => ({
                url: `/projects/${projectId}/sections`,
                params: { opt_fields: "name,gid" },
            }),
            providesTags: (result, _, projectId) =>
                result
                    ? [
                          ...result.data.map(({ gid }) => ({
                              type: "Section" as const,
                              id: gid,
                              project: projectId,
                          })),
                          {
                              type: "Section" as const,
                              id: "LIST",
                              parentId: projectId,
                          },
                      ]
                    : [
                          {
                              type: "Section" as const,
                              id: "LIST",
                              parentId: projectId,
                          },
                      ],
        }),
        uploadAttachment: builder.mutation<
            { data: { gid: string; download_url: string } },
            { file: File; parent: string }
        >({
            query: ({ file, parent }) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("parent", parent);

                return {
                    url: "/attachments",
                    method: "POST",
                    body: formData,
                    prepareHeaders: (headers: {
                        delete: (arg0: string) => void;
                    }) => {
                        headers.delete("content-type");
                        return headers;
                    },
                };
            },
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

        createSectionInProject: builder.mutation<
            { data: { gid: string; name: string } },
            { projectId: string; sectionName: string }
        >({
            query: ({ projectId, sectionName }) => ({
                url: `/projects/${projectId}/sections`,
                method: "POST",
                body: {
                    data: {
                        name: sectionName,
                    },
                },
            }),
            invalidatesTags: (_, __, { projectId }) => [
                { type: "Section", id: "LIST", parentId: projectId },
            ],
        }),

        deleteProject: builder.mutation<void, string>({
            query: (projectId) => ({
                url: `/projects/${projectId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_, __, projectId) => [
                { type: "Project", id: projectId },
                { type: "Project", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useGetProjectsQuery,
    useGetTagsQuery,
    useGetProjectSectionsQuery,
    useUploadAttachmentMutation,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useMoveTaskToSectionMutation,
    useAddTagToTaskMutation,
    useRemoveTagFromTaskMutation,
    useCreateProjectMutation,
    useCreateSectionInProjectMutation,
    useDeleteProjectMutation,
} = apiSlice;
