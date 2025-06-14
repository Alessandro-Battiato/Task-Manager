export type Tag = {
    gid: string;
    name: string;
};

export interface TaskCardProps {
    taskId: string;
    title: string;
    img?: string;
    tags: Array<{
        gid: string;
        name: string;
    }>;
    status: string;
    onClick?: () => void;
    onDelete?: () => void;
    attachments?: Array<{
        gid: string;
        download_url: string;
    }>;
}
