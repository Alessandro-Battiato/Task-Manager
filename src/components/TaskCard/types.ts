export type Tag = {
    gid: string;
    name: string;
};

export interface TaskCardProps {
    title: string;
    tags: Tag[];
    img?: string;
    status: string;
    taskId: string;
    onClick: (value: string) => void;
}
