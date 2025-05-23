import { configureStore } from "@reduxjs/toolkit";
import { asanaApi } from "../features/api/asanaApi";

export const store = configureStore({
    reducer: {
        [asanaApi.reducerPath]: asanaApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(asanaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
