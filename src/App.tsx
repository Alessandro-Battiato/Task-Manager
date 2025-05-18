import React, { useEffect, useState } from "react";
import { useTheme } from "./hooks";
import Sidebar from "./components/Sidebar";
import Board from "./components/Board";

const App: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelectId = (id) => {
        setSelectedId(id);
    };

    const { theme, toggle } = useTheme();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <Sidebar
                toggle={toggle}
                selectedId={selectedId}
                handleSelectId={handleSelectId}
            />

            <Board selectedId={selectedId} />
        </div>
    );
};

export default App;
