import { useState } from "react";
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { getAllUser } from "@/hooks/user/index"
import ModalTambah from "@/components/ui/ModalTambah";
export default function DataUser(){

    const { data: users, isLoading, isError } = getAllUser({});
    const [openModalTambah,setOpenModalTambah] = useState(false);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error ambil data</p>;

    return (
        <div className=""> 
            <div className="flex justify-end mb-6">
                <Button 
                className="bg-main-foreground font-bold"
                onClick={() => setOpenModalTambah(true)}
                >Tambah User</Button>
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
                    {users?.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.password}</TableCell>
                            <TableCell>{user.phonenumber}</TableCell>
                            <TableCell>{user.address}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="flex justify-center  space-x-4">
                                <Button className="bg-chart-2">
                                    Edit
                                </Button>
                                <Button className="bg-chart-4">
                                    Hapus
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {openModalTambah && (
                <ModalTambah onClose={() => setOpenModalTambah(false)} />
            )}
        </div>
    )
}
