import { Button } from "@/components/ui/button";

export default function Pagination({ currentPage, totalPage, setCurrentPage }) {
    const pages = [];

    if (totalPage <= 3) {
    // tampilkan semua jika total halaman <= 3
    for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
        }
    } else if (currentPage === 1) {
        // halaman 1: 1 ... lastPage
        pages.push(1, "...", totalPage);
    } else if (currentPage === totalPage) {
        // halaman terakhir: 1 ... lastPage
        pages.push(1, "...", totalPage);
    } else if (currentPage === 2) {
        // halaman 2: 1 2 ... lastPage
        pages.push(1, 2, "...", totalPage);
    } else if (currentPage === totalPage - 1) {
        // halaman sebelum terakhir: 1 ... (last-1) last
        pages.push(1, "...", totalPage - 1, totalPage);
    } else {
        // halaman tengah: 1 ... current ... lastPage
        pages.push(1, "...", currentPage, "...", totalPage);
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground ">
                Halaman {currentPage} dari {totalPage}
            </p>
            <div className="flex justify-center gap-1 border border-black">
                <Button
                    size="sm"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </Button>
                {pages.map((page, index) => (
                    page === "..." ? (
                        <span key={index} className="px-2">...</span>
                    ) : (
                        <Button
                            key={index}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? "bg-main text-white" : ""}
                        >
                            {page}
                        </Button>
                    )
                ))}
                <Button
                    size="sm"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage === totalPage}
                >
                    &gt;
                </Button>
            </div>
        </div>
    );
}