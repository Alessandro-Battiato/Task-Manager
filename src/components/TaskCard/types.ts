export interface TaskCardProps {
    title: string;
    tags: string[];
    img?: string;
    status: string;
    onClick: (value: string) => void;
}
