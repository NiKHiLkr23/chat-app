"use client";

import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFriendValidator } from "@/lib/validation/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover } from "@headlessui/react";
import { Icons } from "./Icons";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
interface AddFriendButtonProps {}

type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [isFriendReqSent, setIsFriendReqSent] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const handleAddFriend = async (email: string) => {
    setIsLoading(true);
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", { email: validatedEmail });
      setIsFriendReqSent(true);
      reset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", { message: error.message });
        setIsLoading(false);
        return;
      }

      if (error instanceof AxiosError) {
        setError("email", { message: error.response?.data });
        setIsLoading(false);
        return;
      }

      setError("email", { message: "Something went wrong." });
    }

    setIsLoading(false);
  };

  const onSubmit = (data: FormData) => {
    handleAddFriend(data.email);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900 "
      >
        Add friend by E-Mail
      </label>

      <div className="mt-2 flex gap-4">
        <input
          {...register("email")}
          type="text "
          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
          placeholder="you@example.com"
        />
        {isLoading ? (
          <Button className="px-4">
            <Loader2 className="animate-spin h-4 " />
          </Button>
        ) : (
          <Button>Add</Button>
        )}
      </div>
      <div className="flex items-center gap-1 mt-1">
        <p className="text-sm text-red-600">{errors.email?.message}</p>
        {errors.email?.message && (
          <Popover className="relative ">
            <Popover.Button>
              <Icons.CustomTooltip className="h-5 w-5  " />
            </Popover.Button>

            <Popover.Panel className="absolute z-20 ">
              <p className=" w-40 p-2 bg-gray-100 shadow-md rounded-xl text-xs">
                Share this{" "}
                <span
                  onClick={() => {
                    navigator.clipboard.writeText("invite-link");
                    toast("Copied to clipboard!");
                  }}
                  className="cursor-pointer underline text-blue-800  font-semibold tracking-wider"
                >
                  {" "}
                  link
                </span>{" "}
                and invite your friend to DM.
              </p>

              {/* <img src="/solutions.jpg" alt="" /> */}
            </Popover.Panel>
          </Popover>
        )}
      </div>
      {isFriendReqSent ? (
        <p className="mt-1 text-sm text-green-600">Friend Request sent!</p>
      ) : null}
    </form>
  );
};

export default AddFriendButton;
