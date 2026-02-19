import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from "./card";

import { Button } from "./button";
import { Input } from "./input";

export default function ModalTambah({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pt-20">

      <Card className="w-full max-w-sm bg-white p-4">
        <div className="flex w-full justify-between ">
          <h2 className="text-lg font-bold">Tambah User</h2>
          <Button >X</Button>     
        </div>
        <CardContent className="space-y-3">
          <Input placeholder="Nama" />
          <Input placeholder="Email" />
          <Input placeholder="Password" type="password" />
          <Input placeholder="Phone Number" />
          <Input placeholder="Address" />
          <Input placeholder="Role" />

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button className="bg-main-foreground">
              Simpan
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
