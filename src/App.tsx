import React, { useCallback, useState } from "react";
import { useTheme } from "./hooks";
import Sidebar from "./components/Sidebar";
import Board from "./components/Board";

const App: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string>("");

    const { theme, toggle } = useTheme();

    const handleSelectId = useCallback((id: React.SetStateAction<string>) => {
        setSelectedId(id);
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <Sidebar
                theme={theme}
                toggle={toggle}
                selectedId={selectedId}
                handleSelectId={handleSelectId}
            />

            <Board selectedId={selectedId} />
        </div>
    );
};

export default App;
