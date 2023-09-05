"use client";

import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ButtonHTMLAttributes, FC, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "./ui/Button";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  return (
    <>
      <Button
        {...props}
        variant="ghost"
        className="md:hidden shadow-md"
        onClick={async () => {
          setIsSigningOut(true);
          try {
            await signOut();
          } catch (error) {
            toast.error("There was a problem signing out");
          } finally {
            setIsSigningOut(false);
          }
        }}
      >
        {isSigningOut ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <div className="flex items-center justify-center ">
            <LogOut className="w-4 h-4" />
            <span className="px-2 py-2 text-sm font-semibold leading-6 text-gray-900">
              Sign Out
            </span>
          </div>
        )}
      </Button>
      <Button
        {...props}
        variant="ghost"
        className="hidden md:block"
        onClick={async () => {
          setIsSigningOut(true);
          try {
            await signOut();
          } catch (error) {
            toast.error("There was a problem signing out");
          } finally {
            setIsSigningOut(false);
          }
        }}
      >
        {isSigningOut ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
      </Button>
    </>
  );
};

export default SignOutButton;
