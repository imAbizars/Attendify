import { useState } from "react";
import { createUser,editUser} from "@/hooks/user/index";

import {
  Card,
  CardTitle,
  CardContent
} from "./card";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue, } from "./select";
import { Button } from "./button";
import { Input } from "./input";
import { Loader2 } from "lucide-react";

export default function ModalTambah({ onClose,onSuccess,selectedUser}) {

  const [form, setForm] = useState({
    name: selectedUser?.name||"",
    email: selectedUser?.email||"",
    password: selectedUser?.password||"",
    phonenumber: selectedUser?.phonenumber||"",
    address: selectedUser?.address||"",
    role: selectedUser?.role||"",
  });
  const resetForm = ()=>{
     setForm({
          name :"",
          email:"",
          password:"",
          phonenumber:"",
          address:"",
          role:""
     })
  }
  //createuser
  const { mutate:createMutate, isPending:isCreating } = createUser({
    onSuccess: () => {
      onSuccess();
      resetForm();
    },
  });
  //edituser
  const { mutate: editMutate, isPending: isEditing } = editUser({
    onSuccess: () => onSuccess(),
  });
  const handleChange = (e) => { 
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSelectChange = (value)=>{
     setForm({
          ...form,
          role : value,
     })
  }
  const handleSubmit = () => {
    if(selectedUser){
     editMutate({id: selectedUser.id,userData:form});
    }else{
     createMutate(form);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white p-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{selectedUser?"Edit User" : "Tambah User"}</h2>
          <Button className="font-black text-lg" onClick={onClose}>
            ✕
          </Button>
        </div>
        <CardTitle>Isi data pegawai di bawah berikut</CardTitle>
        <CardContent className="space-y-3 p-0">
          <Input name="name" placeholder="Nama" value={form.name} onChange={handleChange} />
          <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input
            name="password"
            type="password"
            value ={form.password}
            placeholder="Password"
            onChange={handleChange}
          />
          <Input
            name="phonenumber"
            value={form.phonenumber}
            placeholder="No Telepon"
            onChange={handleChange}
          />
          <Input
            name="address"
            value={form.address}
            placeholder="Alamat"
            onChange={handleChange}
          />
          <Select defaultValue={form.role} onValueChange={handleSelectChange}>
               <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Role" />
               </SelectTrigger>
               <SelectContent>
                    <SelectGroup>
                         <SelectItem value="ADMIN">ADMIN</SelectItem>
                         <SelectItem value="EMPLOYED">EMPLOYED</SelectItem>
                    </SelectGroup>
               </SelectContent>
          </Select>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="neutral" onClick={onClose}>
              Batal
            </Button>
            <Button
              className="bg-main-foreground"
              onClick={handleSubmit}
              disabled={isCreating || isEditing}
            >
               {isCreating || isEditing ? <Loader2 className="animate-spin "/> : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
