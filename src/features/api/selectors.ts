import { createSelector } from "@reduxjs/toolkit";
import { asanaApi } from "./asanaApi";

export const selectTasksByProjectId = (projectId: string) =>
    createSelector(
        asanaApi.endpoints.getTasks.select(projectId),
        (result) => result?.data?.data ?? []
    );
