import { Pencil } from "lucide-react";

export function IconButton({
    icon, onClick, activated
} : {
    icon?: React.ReactNode;
    onClick?: () => void;
    activated: boolean;
}) {
    return (
        <div className={`cursor-pointer flex items-center space-x-2 rounded-lg p-2 ${activated ? "bg-blue-500 text-white" : "text-white hover:bg-gray-100 hover:text-gray-600"}`} onClick={onClick}>
            {icon}
        </div>
    )
}