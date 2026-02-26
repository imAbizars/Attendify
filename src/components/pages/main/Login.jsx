import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
export default function Login(){
    return(
        <div className="flex min-h-screen justify-center items-center">
            <Card className="w-full max-w-sm m-4">
                <CardHeader>
                    <CardTitle className="text-xl">Attendify </CardTitle>
                    <CardDescription>
                    Silahkan Login Terlebih Dahulu
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                        </div>
                        <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <a
                            href="#"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                            Forgot your password?
                            </a>
                        </div>
                        <Input id="password" type="password" required />
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full">
                    Login
                    </Button>
                    <Button variant="neutral" className="w-full">
                    Login with Google
                    </Button>
                    <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a href="#" className="underline underline-offset-4">
                        Sign up
                    </a>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}