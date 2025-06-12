export type Task = {
    gid: string;
    name: string;
    memberships: Array<{
        section: {
            name: string;
        };
    }>;
    tags: Array<{
        gid: string;
        name: string;
    }>;
    attachments?: Array<{
        gid: string;
        download_url: string;
    }>;
};
