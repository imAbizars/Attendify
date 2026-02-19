import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

import { getAllUser } from "@/hooks/user/index"

export default function DataUser(){

    const { data: users, isLoading, isError } = getAllUser({});

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error ambil data</p>;

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Role</TableHead>
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
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </div>
    )
}
