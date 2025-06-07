import { createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

export const selectTasksByProjectId = (projectId: string) =>
    createSelector(
        apiSlice.endpoints.getTasks.select(projectId),
        (result) => result?.data?.data ?? []
    );

export const selectSectionIdByStatus = (projectId: string, status: string) =>
    createSelector(
        apiSlice.endpoints.getProjectSections.select(projectId),
        (result) => {
            const statusArr = result?.data?.data ?? [];

            return statusArr.find((obj) => obj.name === status)?.gid;
        }
    );
