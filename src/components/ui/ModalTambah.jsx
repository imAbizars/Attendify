import { useState } from "react";
import { createUser } from "@/hooks/user/index";

import {
  Card,
  CardContent
} from "./card";

import { Button } from "./button";
import { Input } from "./input";

export default function ModalTambah({ onClose }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phonenumber: "",
    address: "",
    role: "",
  });
  //createuser
  const { mutate, isPending } = createUser({
    onSuccess: () => {
      alert("User berhasil ditambahkan");
      onClose();
    },
  });

  const handleChange = (e) => { 
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    mutate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Card className="w-full max-w-sm bg-white p-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Tambah User</h2>
          <Button onClick={onClose}>
            ✕
          </Button>
        </div>
        <CardContent className="space-y-3 p-0">
          <Input name="name" placeholder="Nama" onChange={handleChange} />
          <Input name="email" placeholder="Email" onChange={handleChange} />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <Input
            name="phonenumber"
            placeholder="Phone Number"
            onChange={handleChange}
          />
          <Input
            name="address"
            placeholder="Address"
            onChange={handleChange}
          />
          <Input name="role" placeholder="Role" onChange={handleChange} />
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="neutral" onClick={onClose}>
              Batal
            </Button>
            <Button
              className="bg-main-foreground"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
