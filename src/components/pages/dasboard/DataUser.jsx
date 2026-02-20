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
export default function DataUser(){

    const { data: users, isLoading, isError } = getAllUser({});
    const [openModalTambah,setOpenModalTambah] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const { mutate: deleteMutate, isPending: isDeleting } = deleteUser({
        onSuccess: () => {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 2000);
        },
    })

    const handleDelete = (id) => {
            deleteMutate(id);
    };


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
                    <Button className="bg-chart-2">Edit</Button>
                    <AlertCostum onConfirm={() => handleDelete(user.id)}>
                        <Button
                            className="bg-chart-4"
                            disabled={isDeleting}
                        >
                            Hapus
                        </Button>
                    </AlertCostum>

                </TableCell>
            </TableRow>
        ));
    };
    // todo refetch data user ketika data user di tambahkan 
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
                <ModalTambah onClose={() => setOpenModalTambah(false)} />
            )}
            {showAlert && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <Alert className="w-96 bg-white shadow-xl">
                    <AlertDescription className="text-black">
                        Data berhasil dihapus
                    </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    )
}
