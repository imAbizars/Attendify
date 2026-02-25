import { useState } from "react";
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
import {CircleCheck,Trash2,PenBox} from "lucide-react";
export default function DataUser(){

    const { data: users, isLoading, isError } = getAllUser({}); 
    const [openModalTambah,setOpenModalTambah] = useState(false);
    const [selectedUser,setselectedUser] = useState(null);
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
    //render data
    const renderUserData = () => {
        return users?.map((user) => (
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
                    <Button className="bg-main-foreground">Cari</Button>
                    <Input className="w-60 h-11"/>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {renderUserData()}
                </TableBody>
                
            </Table>
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
