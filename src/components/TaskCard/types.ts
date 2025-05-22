export interface TaskCardProps {
    title: string;
    tags: string[];
    img?: string;
    status: string;
    taskId: string;
    onClick: (value: string) => void;
}
