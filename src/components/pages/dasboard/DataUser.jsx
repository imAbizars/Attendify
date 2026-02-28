import { useState,useEffect } from "react";
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAllUser } from "@/hooks/user/index"
import ModalTambah from "@/components/ui/ModalTambah";
import { deleteUser } from "@/hooks/user/index";
import AlertCostum from "@/components/ui/AlertCostum";
import { Alert,AlertDescription} from "@/components/ui/alert";
import {CircleCheck,Trash2,PenBox,Search,Loader2} from "lucide-react";
export default function DataUser(){ 

    const { data: users, isLoading, isError } = getAllUser({}); 
    const [openModalTambah,setOpenModalTambah] = useState(false);
    
    //selected user
    const [selectedUser,setselectedUser] = useState(null);
    //search
    const [search,setSearch]= useState("");
    const [searchQuery, setSearchQuery] = useState("");

    //alert
    const [alert, setAlert] = useState(null);
    const [isLeaving, setIsLeaving] = useState(false);   
    const showAlert = (message) => {
        setIsLeaving(false);
        setAlert({ message });
        
        setTimeout(() => {
            setIsLeaving(true); 
            setTimeout(() => setAlert(null), 300); 
        }, 2000);
    };
    //handle search
    const filteredUsersSearch = users?.filter((user)=>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);
    //pagination
    const [currentPage,setCurrentPage] = useState(1);
    const itemsPerPages = 5;
    const totalPages = Math.ceil((filteredUsersSearch?.length||0)/itemsPerPages);
    const getPageNumbers = () => {
        const pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) {
                pages.push("..."); 
            }
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) {
                pages.push("..."); 
            }
            pages.push(totalPages); 
        }
        return pages;
    };
    //slice data halaman
    const paginatedHalaman = filteredUsersSearch?.slice(
        (currentPage-1) * itemsPerPages,
        currentPage * itemsPerPages
    )
    const { mutate: deleteMutate, isPending: isDeleting } = deleteUser({
        onSuccess: () => showAlert('Data berhasil dihapus'),
    });
    //handle tambah
    const handleSuccessTambah = () => {
        showAlert('Data berhasil ditambahkan');
    };
    //handle delete
    const handleDelete = (id) => {
            deleteMutate(id);
    };
    //hande edit
    const handleSuccessEdit = ()=>{
        showAlert('Data Berhasil diupdate');
    }
    const hiddenPassword = ()=>{
        
    }
    //render data
    const renderUserData = () => {
        return paginatedHalaman?.map((user) => (
            <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>{user.phonenumber}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex justify-center space-x-4">
                    <Button 
                    className="bg-chart-2"
                    onClick={()=>{
                        setselectedUser(user);
                        setOpenModalTambah(true);
                    }}
                    ><PenBox/></Button>
                    <AlertCostum onConfirm={() => handleDelete(user.id)}>
                        <Button
                            className="bg-chart-4"
                            disabled={isDeleting}
                        >
                        <Trash2/>
                        </Button>
                    </AlertCostum>

                </TableCell>
            </TableRow>
        ));
    };
    return (
        <div className=""> 
            <div className="flex justify-between mb-6 items-center">
                <Button 
                className="bg-main-foreground font-bold"
                onClick={() => setOpenModalTambah(true)}
                >Tambah User</Button>
                <div className="flex items-center space-x-4">
                    <Button 
                    className="bg-main-foreground"
                    onClick={()=>setSearchQuery(search)}
                    ><Search strokeWidth={3}/></Button>
                    <Input 
                    className="w-60 h-11" 
                    placeholder="Search by nama"
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    />
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>No telepon</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading? (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <div className="flex items-center justify-center gap-2 py-4">
                                    <Loader2 className="animate-spin" size={20}/>
                                    <span>Memuat data...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : filteredUsersSearch?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <div className="flex items-center justify-center gap-2">
                                    <Search size={20}/>
                                    <span>Data Tidak Ditemukan</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        // Render data
                        renderUserData()
                    )}
                </TableBody>
                
            </Table>
            <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-bold">
                    Halaman {currentPage} dari {totalPages}
                </span>
                <div className="flex items-center gap-2">
                    <Button
                        className="bg-main-foreground"
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                    >
                        Sebelumnya
                    </Button>

                    {getPageNumbers().map((page, index) => (
                        page === "..." ? (
                            <span key={index} className="px-2">...</span>
                        ) : (
                            <Button
                                key={index}
                                onClick={() => setCurrentPage(page)}
                                className={currentPage === page ? "bg-main-foreground" : "bg-main text-black"}
                            >
                                {page}
                            </Button>
                        )
                    ))}

                    <Button
                        className="bg-main-foreground"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Selanjutnya
                    </Button>
                </div>
            </div>
            {openModalTambah && (
                <ModalTambah 
                onClose={() => {
                    setOpenModalTambah(false);
                    setselectedUser(null);
                }}
                onSuccess={selectedUser?handleSuccessEdit:handleSuccessTambah}
                selectedUser={selectedUser}
                />
            )}
            {
                alert &&(
                <div className="flex fixed top-2 left-1/2 -translate-x-1/2 z-[999]">
                    <Alert className={`bg-white shadow-xl ${isLeaving?'animate-slideUp':'animate-slideDown'} `}>
                        <CircleCheck strokeWidth={3.5}/>
                        <AlertDescription className="font-bold text-base">
                            {alert.message}
                        </AlertDescription>
                    </Alert>
                </div>
                )
            }
        </div>
    )
}
