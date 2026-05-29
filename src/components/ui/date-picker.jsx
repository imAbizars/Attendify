import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
export default function DatePicker({ value, onChange }) {
    const today = new Date();
    const [viewDate, setViewDate] = useState(value || today);
    const [mode, setMode] = useState("date"); // "date" | "year"

    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const monthNames = [
        "Januari","Februari","Maret","April","Mei","Juni",
        "Juli","Agustus","September","Oktober","November","Desember"
    ];
    const dayNames = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    const selectDate = (day) => {
        const selected = new Date(currentYear, currentMonth, day);
        onChange(selected);
    };

    const selectYear = (year) => {
        setViewDate(new Date(year, currentMonth, 1));
        setMode("date");
    };

    const isSelected = (day) => {
        if (!value) return false;
        return (
            value.getDate() === day &&
            value.getMonth() === currentMonth &&
            value.getFullYear() === currentYear
        );
    };

    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    return (
        <div className="w-64 p-2 select-none">
            <div className="flex items-center justify-between mb-2">
                {mode === "date" && (
                    <button onClick={prevMonth} className="p-1 border-2 border-black rounded">
                        <ChevronLeftIcon size={16} />
                    </button>
                )}

                <button
                    onClick={() => setMode(mode === "year" ? "date" : "year")}
                    className="flex items-center gap-1 font-semibold text-sm border-2 border-black px-2 py-1 rounded mx-auto"
                >
                    {monthNames[currentMonth]} {currentYear}
                    <ChevronDownIcon size={14} className={mode === "year" ? "rotate-180 transition-transform" : "transition-transform"} />
                </button>

                {mode === "date" && (
                    <button onClick={nextMonth} className="p-1 rounded border-2 border-black">
                        <ChevronRightIcon size={16} />
                    </button>
                )}
            </div>

            {mode === "year" && (
                <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto">
                    {years.map((year) => (
                        <button
                            key={year}
                            onClick={() => selectYear(year)}
                            className={`text-sm py-1 rounded border-2 border-black hover:bg-white ${
                                year === currentYear ? "text-black border-2 border-black bg-white" : ""
                            }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            )}

            {mode === "date" && (
                <>
                    <div className="grid grid-cols-7 mb-1">
                        {dayNames.map((d) => (
                            <div key={d} className="text-center text-xs text-gray font-medium py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-1">
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                            <button
                                key={day}
                                onClick={() => selectDate(day)}
                                className={`text-sm w-8 h-8 rounded-md border-2 border-black hover:bg-white ${
                                    isSelected(day) ? "bg-white text-black" : ""
                                }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}