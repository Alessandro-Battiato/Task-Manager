import { createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

export const selectTasksByProjectId = (projectId: string) =>
    createSelector(
        apiSlice.endpoints.getTasks.select(projectId),
        (result) => result?.data?.data ?? []
    );
